import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/infra/app.module';
import { EnvService } from '@/infra/env/env.service';
import * as cookieParser from 'cookie-parser';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  app.use(cookieParser());

  await app.listen(port);

  log(`🟢 HTTP app is running on: ${await app.getUrl()}`);
}
bootstrap();
