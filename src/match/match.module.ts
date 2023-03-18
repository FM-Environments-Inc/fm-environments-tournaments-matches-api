import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';
import { Match } from './match.entity';
import { MatchesRPCService } from './match-rpc.service';
import { SeasonModule } from '../season/season.module';
import { MatchActionService } from './match-action.service';
import { MatchAction } from './match-action.entity';

// eslint-disable-next-line
require('dotenv').config();

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchAction]), SeasonModule],
  providers: [
    MatchService,
    MatchResolver,
    MatchesRPCService,
    MatchActionService,
    {
      provide: 'TEAMS_PACKAGE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'teams',
            protoPath: join(process.cwd(), 'src/proto/teams.proto'),
            url: `${process.env.TEAMS_RPC_URL}`,
          },
        });
      },
    },
  ],
  controllers: [MatchesRPCService],
  exports: [MatchService, MatchesRPCService, MatchActionService],
})
export class MatchModule {}
