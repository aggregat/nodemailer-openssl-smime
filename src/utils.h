#ifndef __UTILS_H__
#define __UTILS_H__

#include "common.h"

struct BioDeleter {
  void operator()(BIO *const pBio) const {
    if (pBio) {
      BIO_free(pBio);
    }
  }
};

struct X509Deleter {
  void operator()(X509 *const pX509) const {
    if (pX509) {
      X509_free(pX509);
    }
  }
};

struct X509StackDeleter {
  void operator()(STACK_OF(X509) *const pStack) const {
    if (pStack) {
      sk_X509_pop_free(pStack, X509_free);
    }
  }
};

struct PrivateKeyDeleter {
  void operator()(EVP_PKEY *const pPrivateKey) const {
    if (pPrivateKey) {
      EVP_PKEY_free(pPrivateKey);
    }
  }
};

struct Pkcs7Deleter {
  void operator()(PKCS7 *const pPkcs7) const {
    if (pPkcs7) {
      PKCS7_free(pPkcs7);
    }
  }
};

#endif