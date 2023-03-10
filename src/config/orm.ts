import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line
require('dotenv').config();

const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  migrations: [path.resolve(__dirname, '..', 'migrations', '*')],
  entities: [path.resolve(__dirname, '..', '**', '*.entity.*')],
  synchronize: true,
};

module.exports = options;
