import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetCurrentSeasonArgs } from './dto/args/get-season.args';
import { GetSeasonsArgs } from './dto/args/get-seasons.args';
import { CreateSeasonInput } from './dto/input/create-season.input';
import { FinishSeasonInput } from './dto/input/finish-season.input';
import { SORT_WAY } from '../config/constants';

import { Season } from './season.entity';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private seasonRepository: Repository<Season>,
  ) {}

  public async create(createSeasonInput: CreateSeasonInput): Promise<Season> {
    const currentSeason = await this.get({
      environment: createSeasonInput.environment,
    });

    if (currentSeason && !currentSeason.finishedAt) {
      throw new Error('Cannot create season having unfinished one');
    }

    const newEnvironment = this.seasonRepository.create({
      ...createSeasonInput,
      sequenceNumber: currentSeason ? currentSeason.sequenceNumber + 1 : 1,
    });
    return this.seasonRepository.save(newEnvironment);
  }

  public async finish(finishSeasonInput: FinishSeasonInput): Promise<Season> {
    const currentSeason = await this.get({
      environment: finishSeasonInput.environment,
      finishedAt: null,
    });

    if (!currentSeason) {
      throw new Error('Current season not found');
    }

    return this.seasonRepository.save({
      ...currentSeason,
      finishedAt: new Date(),
    });
  }

  public get(getCurrentSeasonArgs: GetCurrentSeasonArgs): Promise<Season> {
    return this.seasonRepository.findOne({
      where: getCurrentSeasonArgs,
      order: {
        sequenceNumber: SORT_WAY.DESC,
      },
    });
  }

  public getAll(getSeasonsArgs: GetSeasonsArgs): Promise<Season[]> {
    return this.seasonRepository.find({
      where: getSeasonsArgs,
      order: {
        sequenceNumber: SORT_WAY.DESC,
      },
    });
  }
}
