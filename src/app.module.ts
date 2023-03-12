import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

import { DatabaseModule } from './database/database.module';
import { SeasonModule } from './season/season.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        path: join(process.cwd(), 'src/graphql-schema.gql'),
        federation: 2,
      },
      debug: true,
    }),
    DatabaseModule,
    SeasonModule,
    MatchModule,
  ],
  providers: [],
})
export class AppModule {}
