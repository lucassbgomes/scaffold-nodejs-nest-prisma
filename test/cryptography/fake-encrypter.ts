import { Encrypter } from '@/domain/website/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }

  async verify(token: string): Promise<Record<string, unknown>> {
    const tokenStringify = `{ "token": "${token}"}`;

    return JSON.parse(tokenStringify);
  }
}
