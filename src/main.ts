import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';

// eslint-disable-next-line
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'matches',
      protoPath: join(process.cwd(), 'src/proto/matches.proto'),
      url: `${process.env.HOST}:${process.env.GRPC_PORT}`,
    },
  });
  app.startAllMicroservices();

  const port = process.env.SERVER_PORT || 3007;
  await app.listen(port);
  console.log('Server listening on', port);
}
bootstrap();
