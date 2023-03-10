import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { SeasonResolver } from './season.resolver';
import { SeasonService } from './season.service';
import { Season } from './season.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Season])],
  providers: [SeasonService, SeasonResolver],
  exports: [SeasonService],
})
export class SeasonModule {}
