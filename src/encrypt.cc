#include "utils.h"

// S/MIME encryption
// https://github.com/openssl/openssl/blob/openssl-3.0.7/demos/smime/smenc.c
Napi::Buffer<unsigned char>
encrypt(Napi::Env &env, const Napi::Buffer<unsigned char> &message,
        const Napi::Buffer<unsigned char> &key, const Napi::String &cipher,
        const std::optional<Napi::Object> &headers) {

  // Open content being encrypted
  std::unique_ptr<BIO, BioDeleter> pMessage(BIO_new(BIO_s_mem()));

  BIO_write(pMessage.get(), message.Data(), message.Length());

  if (!pMessage)
    throw(Napi::Error::New(env, "Error creating message"));

  // Public key
  std::unique_ptr<BIO, BioDeleter> pKey(BIO_new(BIO_s_mem()));
  BIO_write(pKey.get(), key.Data(), key.Length());

  if (!pKey)
    throw(Napi::Error::New(env, "Error creating public key"));

  std::unique_ptr<X509, X509Deleter> pPublicKey(
      PEM_read_bio_X509(pKey.get(), nullptr, nullptr, nullptr));
  if (!pPublicKey)
    throw(Napi::Error::New(env, "Error parsing public key"));

  std::unique_ptr<STACK_OF(X509), X509StackDeleter> pRecipients(
      sk_X509_new_null());
  if (!pRecipients)
    throw(Napi::Error::New(env, "Error creating recipient stack"));

  if (!sk_X509_push(pRecipients.get(), pPublicKey.get()))
    throw(Napi::Error::New(env, "Error adding recipient certificate to stack"));

  // sk_X509_pop_free will free up recipient STACK and its contents so set rcert
  // to NULL so it isn't freed up twice
  pPublicKey.release();

  // Cipher
  const EVP_CIPHER *pCipher(EVP_get_cipherbyname(cipher.Utf8Value().c_str()));
  if (!pCipher)
    throw(Napi::Error::New(env, "Cipher resolution failed"));

  const int flags = PKCS7_STREAM;

  // encrypt content
  std::unique_ptr<PKCS7, Pkcs7Deleter> pPkcs7(
      PKCS7_encrypt(pRecipients.get(), pMessage.get(), pCipher, flags));
  if (!pPkcs7)
    throw(Napi::Error::New(env, "Error encrypting content"));

  // Allocate result
  std::unique_ptr<BIO, BioDeleter> pResult(BIO_new(BIO_s_mem()));
  if (!pResult)
    throw(Napi::Error::New(env, "Error creating result"));

  if (headers) {
    for (const auto &h : *headers) {
      const Napi::Value &key(h.first);
      const Napi::Value &value(h.second);
      if (key.IsString() && value.IsString())
        BIO_printf(pResult.get(), "%s: %s\n",
                   key.As<Napi::String>().Utf8Value().c_str(),
                   value.As<Napi::String>().Utf8Value().c_str());
    }
  }

  // Write out S/MIME message
  if (!SMIME_write_PKCS7(pResult.get(), pPkcs7.get(), pMessage.get(), flags))
    throw(Napi::Error::New(env, "Error writing S/MIME message"));

  unsigned char *pData(nullptr);
  const std::size_t dataSize(BIO_get_mem_data(pResult.get(), &pData));

  return Napi::Buffer<unsigned char>::Copy(env, pData, dataSize);
}
