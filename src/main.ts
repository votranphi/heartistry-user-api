import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // create swagger document
  const config = new DocumentBuilder()
    .setTitle('Heartistry User/Auth API Documentation')
    .setDescription('RESTful API for Heartistry (user management and authentication)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;
  console.log(port);
  await app.listen(port);

  // allow hot module
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
