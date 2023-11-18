export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown> | Buffer,
    options?: unknown,
  ): Promise<string>;

  abstract verify(token: string): Promise<Record<string, unknown>>;
}
