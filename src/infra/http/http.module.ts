import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/infra/database/database.module';

import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

import { UsersModule } from '@/infra/http/controllers/users/users.module';
import { SessionsModule } from '@/infra/http/controllers/sessions/sessions.module';
import { PostsModule } from '@/infra/http/controllers/posts/posts.module';
import { SeoOverridesModule } from '@/infra/http/controllers/seo-overrides/seo-overrides.module';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    SessionsModule,
    UsersModule,
    PostsModule,
    SeoOverridesModule,
  ],
})
export class HttpModule {}
