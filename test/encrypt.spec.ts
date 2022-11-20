import { encrypt } from "..";

describe("encrypt", () => {
  it("should be defined", () => {
    expect(encrypt).toBeDefined();
  });

  it("should encrypt", () => {
    const signer = Buffer.from(
      `-----BEGIN CERTIFICATE-----
MIIELDCCApSgAwIBAgIIcsOElVeHzfQwDQYJKoZIhvcNAQELBQAwVzELMAkGA1UE
BhMCVUsxEjAQBgNVBAcMCVRlc3QgQ2l0eTEWMBQGA1UECgwNT3BlblNTTCBHcm91
cDEcMBoGA1UEAwwTVGVzdCBTL01JTUUgUm9vdCBDQTAgFw0xODA2MTQxMjQ2Mjha
GA8yMTE4MDYxNDEyNDYyOFowVjELMAkGA1UEBhMCVUsxJTAjBgNVBAMMHE9wZW5T
U0wgdGVzdCBTL01JTUUgc2lnbmVyIDExIDAeBgkqhkiG9w0BCQEWEXRlc3QxQG9w
ZW5zc2wub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1vvSgaL1
byi9AE8Ep3v7Yv36JxYywaZhUy8dEFRiYn6NsVhhNo6SK1Mp8daQ0MZoMzbT1aKp
JTLTgDJZHit2t1d6l3aWJG+cbcLua+XKowaZjj6rirB390fuL4qt5PiAb571QFtu
L8apcydwGEdkaPRuCnvctN8VcZPTKh+M8VEESyxk5K37QYKaAB6ItWR5KhjiAuDt
zsJbjEtOvGtmu2FRCU47GzfkdjYo7tY38WTY+2WWh+idKErtmYSinmhE0H7+yoJB
s1VCI+cq5tVW+oEO9HF4vEDEUykEFFPsCEkIWM+RjCgK8cRSCpg6VQr+ZTii6k7C
m9CP81QhUoV3QwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1P
cGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUg1DE7OaNqMQQ
8Z1bvjhnlisxfsMwHwYDVR0jBBgwFoAUpJjGgWED0xBnKntZmlNiAzjC0HswDQYJ
KoZIhvcNAQELBQADggGBAGxAivCwPsAYmMZfVJTELWNNMBzKzmeRvrp6k/6S74Pw
LDEhTnslCV4U1gTSd3nQ+LRm1fkzxLA12A/rlqN51P8B+hyVSMN9dj54YUcFd+KO
XhkSDrSpph6hRqGy8zqELzlb1Q8yoIBclEmyv+CkXMrpnm+4JL4kzyj/iBRkZTDz
ns15jJD9KHgrOnclaoDRkOT6lGbsd3j+aviKEj8ZILufSMw+W2YORy3nSAencjbO
ezivVujqm+pjkfqdCS1HcFB7LhQEILfFqkssw8YmtJVrM9LF8VIcqueXbVZmeS/1
QV5B7OEmtsM+NkoLF5ldWdPQvmftbShh+AAlpcsmqiRefQgA3aQn6YOnOHnnQwgB
oQRNjQXsjgxV4t2HFYpwkK41kx4HToVGciPNMkndzfY/GJmgXsXfB6/AfUfhLTDv
tbws1MZhaCNOffw3/SVS2nLREMFCGn5uAgNkqssWqeWJu3910XF640tqPBj5YGFc
fykwWNhG5xS04EHpztgKdQ==
-----END CERTIFICATE-----`
    );

    const message = Buffer.from(`Hello world`);
    const result = encrypt(message, signer);
    expect(Buffer.isBuffer(result)).toBe(true);
  });
});