#include "utils.h"

// S/MIME decryption
// https://github.com/openssl/openssl/blob/openssl-3.0.7/demos/smime/smdec.c
Napi::Buffer<unsigned char>
decrypt(Napi::Env &env, const Napi::Buffer<unsigned char> &message,
        const Napi::Buffer<unsigned char> &keyPair) {

  // Open content being decrypted
  std::unique_ptr<BIO, BioDeleter> pMessage(BIO_new(BIO_s_mem()));

  BIO_write(pMessage.get(), message.Data(), message.Length());

  if (!pMessage)
    throw(Napi::Error::New(env, "Error creating message"));

  std::unique_ptr<PKCS7, Pkcs7Deleter> pPkcs7(
      SMIME_read_PKCS7(pMessage.get(), nullptr));

  // Key pair
  std::unique_ptr<BIO, BioDeleter> pKeyPair(BIO_new(BIO_s_mem()));
  BIO_write(pKeyPair.get(), keyPair.Data(), keyPair.Length());

  if (!pKeyPair)
    throw(Napi::Error::New(env, "Error creating key pair"));

  std::unique_ptr<X509, X509Deleter> pPublicKey(
      PEM_read_bio_X509(pKeyPair.get(), nullptr, nullptr, nullptr));

  if (!pPublicKey)
    throw(Napi::Error::New(env, "Error parsing public key"));

  // Private key
  std::unique_ptr<EVP_PKEY, PrivateKeyDeleter> pPrivateKey(
      PEM_read_bio_PrivateKey(pKeyPair.get(), nullptr, nullptr, nullptr));

  if (!pPrivateKey)
    throw(Napi::Error::New(env, "Error parsing private key"));

  // Allocate result
  std::unique_ptr<BIO, BioDeleter> pResult(BIO_new(BIO_s_mem()));
  if (!pResult)
    throw(Napi::Error::New(env, "Error creating result"));

  // Write out decrypted
  if (!PKCS7_decrypt(pPkcs7.get(), pPrivateKey.get(), pPublicKey.get(),
                     pResult.get(), 0))
    throw(Napi::Error::New(env, "Error writing S/MIME message"));

  unsigned char *pData(nullptr);
  const std::size_t dataSize(BIO_get_mem_data(pResult.get(), &pData));

  return Napi::Buffer<unsigned char>::Copy(env, pData, dataSize);
};