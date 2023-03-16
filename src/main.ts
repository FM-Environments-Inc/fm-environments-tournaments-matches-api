import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

// eslint-disable-next-line
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'matches',
      protoPath: join(process.cwd(), 'src/proto/matches.proto'),
      url: `${process.env.HOST}:${process.env.SERVER_PORT}`,
    },
  });
  app.startAllMicroservices();

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.SERVER_PORT || 3007);
}
bootstrap();
