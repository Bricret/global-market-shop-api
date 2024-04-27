import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

  app.setGlobalPrefix('api')

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
