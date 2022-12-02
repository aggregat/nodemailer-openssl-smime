export const fromStringOrBuffer = <TInput extends string | Buffer>(
  input: TInput
) => (Buffer.isBuffer(input) ? input : Buffer.from(input));

export const toStringOrBuffer = <TInput extends string | Buffer>(
  input: TInput,
  output: Buffer
): string | Buffer => (Buffer.isBuffer(input) ? output : output.toString());
