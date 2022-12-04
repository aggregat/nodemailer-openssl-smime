# Nodemailer S/MIME Encryption via OpenSSL

## Installation

```sh
npm i nodemailer-openssl-smime --save
```

## Usage

```typescript
import { createTransport } from "nodemailer";
import smime from "nodemailer-openssl-smime";

const sendEncryptedEmail = async () => {
  const transport = createTransport({
    /* ... */
  }).use("stream", smime({ recipient: "-----BEGIN CERTIFICATE-----..." }));

  await transport.sendMail({
    from: "sender@example.com",
    to: "recipient@example.com",
    subject: "This is a test",
    text: "Hello world",
  });
};
```
