import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

function setApiDocs(app: INestApplication, path: string) {
  const config = new DocumentBuilder()
    .setTitle('Facebook API examples')
    .setDescription('The Facebook Graph API playground')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV', 'development');
  const apiDocPath = 'docs';

  if ('development' === nodeEnv) {
    setApiDocs(app, apiDocPath);
  }

  const port = configService.get('PORT') || '3000';
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`with ${nodeEnv} environment`);
  'development' === nodeEnv &&
    console.log(`Docs ${await app.getUrl()}/${apiDocPath}`);
}

bootstrap();
