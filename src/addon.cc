#include "common.h"

void init();

Napi::Buffer<unsigned char> decrypt(Napi::Env &env,
                                    const Napi::Buffer<unsigned char> &message,
                                    const Napi::Buffer<unsigned char> &keyPair);

Napi::Buffer<unsigned char> encrypt(Napi::Env &env,
                                    const Napi::Buffer<unsigned char> &message,
                                    const Napi::Buffer<unsigned char> &key,
                                    const Napi::String &cipher);

Napi::Buffer<unsigned char> Encrypt(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 3)
    throw(Napi::Error::New(env, "Wrong number of arguments"));
  if (!info[0].IsBuffer())
    throw(Napi::Error::New(env, "Invalid message specified"));
  if (!info[1].IsBuffer())
    throw(Napi::Error::New(env, "Invalid certificate specified"));
  if (!info[2].IsString())
    throw(Napi::Error::New(env, "Invalid cipher specified"));

  return (encrypt(env, info[0].As<Napi::Buffer<unsigned char>>(),
                  info[1].As<Napi::Buffer<unsigned char>>(),
                  info[2].As<Napi::String>()));
}

Napi::Buffer<unsigned char> Decrypt(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 2)
    throw(Napi::Error::New(env, "Wrong number of arguments"));
  if (!info[0].IsBuffer())
    throw(Napi::Error::New(env, "Invalid message specified"));
  if (!info[1].IsBuffer())
    throw(Napi::Error::New(env, "Invalid keypair specified"));

  return (decrypt(env, info[0].As<Napi::Buffer<unsigned char>>(),
                  info[1].As<Napi::Buffer<unsigned char>>()));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  init();

  exports.Set(Napi::String::New(env, "encrypt"),
              Napi::Function::New(env, Encrypt));

  exports.Set(Napi::String::New(env, "decrypt"),
              Napi::Function::New(env, Decrypt));

  return exports;
}

NODE_API_MODULE(addon, Init)