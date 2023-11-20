import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { log } from 'console';

import { AppModule } from '@/infra/app.module';
import { EnvService } from '@/infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  const options = new DocumentBuilder()
    .setTitle('Scaffold Node.js with NestJS and Prisma')
    .setDescription('A Node.js scaffold with NestJS and Prisma.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Sessions', 'Manage Sessions Related Requests')
    .addTag('Users', 'Manage User Related Requests')
    .addTag('Posts', 'Manage Post Related Requests')
    .addTag('Seo Overrides', 'Manage Seo Override Related Requests')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  log(`🟢 HTTP app is running on: ${await app.getUrl()}`);
}
bootstrap();
