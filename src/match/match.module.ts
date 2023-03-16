import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';
import { Match } from './match.entity';
import { MatchesRPCService } from './match-rpc.service';
import { SeasonModule } from '../season/season.module';

// eslint-disable-next-line
require('dotenv').config();

@Module({
  imports: [TypeOrmModule.forFeature([Match]), SeasonModule],
  providers: [MatchService, MatchResolver, MatchesRPCService],
  controllers: [MatchesRPCService],
  exports: [MatchService, MatchesRPCService],
})
export class MatchModule {}
