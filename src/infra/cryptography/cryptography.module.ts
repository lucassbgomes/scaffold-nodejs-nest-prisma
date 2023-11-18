import { Module } from '@nestjs/common';

import { Encrypter } from '@/domain/website/application/cryptography/encrypter';
import { HashComparer } from '@/domain/website/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/website/application/cryptography/hash-generator';

import { JwtEncrypter } from './jwt-encrypter.cryptography';
import { BcryptHasher } from './bcrypt-hasher.cryptography';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
