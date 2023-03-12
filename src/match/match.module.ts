import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { MatchResolver } from './match.resolver';
import { MatchService } from './match.service';
import { Match } from './match.entity';
import { SeasonModule } from '../season/season.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), SeasonModule],
  providers: [MatchService, MatchResolver],
  exports: [MatchService],
})
export class MatchModule {}
