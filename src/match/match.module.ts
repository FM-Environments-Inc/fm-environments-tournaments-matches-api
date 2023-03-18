import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

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
  ],
  controllers: [MatchesRPCService],
  exports: [MatchService, MatchesRPCService, MatchActionService],
})
export class MatchModule {}
