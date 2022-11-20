#include "common.h"

void init() {
  OpenSSL_add_all_algorithms();
  ERR_load_crypto_strings();
}