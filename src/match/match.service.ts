import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';

import { Match } from './match.entity';
import { SeasonService } from '../season/season.service';

import { GetLatestTeamMatchesArgs } from './dto/args/get-latest-team-matches.args';
import { GetMatchArgs } from './dto/args/get-match.args';
import { CreateMatchInput } from './dto/input/create-match.input';
import { FinishMatchInput } from './dto/input/finish-match.input';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    private seasonService: SeasonService,
  ) {}

  public async getLatestTeamMatches(
    getLatestTeamMatchesArgs: GetLatestTeamMatchesArgs,
  ): Promise<Match[]> {
    const { teamId, count, environment } = getLatestTeamMatchesArgs;

    const DEFAULT_TAKE = 5;

    // TODO: get teams details

    return this.matchRepository.find({
      where: [
        {
          finishedAt: Not(IsNull()),
          team1: teamId,
          environment,
        },
        {
          finishedAt: Not(IsNull()),
          team2: teamId,
          environment,
        },
      ],
      order: { finishedAt: 'DESC' },
      take: count || DEFAULT_TAKE,
    });
  }

  public async create(createMatchInput: CreateMatchInput): Promise<Match> {
    const currentSeason = await this.seasonService.get({
      environment: createMatchInput.environment,
      finishedAt: null,
    });

    if (!currentSeason) {
      throw new Error('Season not found');
    }

    const newMatch = this.matchRepository.create(createMatchInput);
    return this.matchRepository.save(newMatch);
  }

  public async finish(finishMatchInput: FinishMatchInput): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: {
        id: finishMatchInput.id,
      },
    });

    if (match) {
      if (match.finishedAt) {
        throw new Error('Match is already finished');
      }

      return this.matchRepository.save({
        ...match,
        team1Goals: finishMatchInput.team1Goals,
        team2Goals: finishMatchInput.team2Goals,
        winner: finishMatchInput.winner,
        finishedAt: new Date(),
      });
    }

    throw new Error('Match not found');
  }

  public async get(getMatchArgs: GetMatchArgs): Promise<Match> {
    const { id } = getMatchArgs;

    // TODO: get teams details

    return this.matchRepository.findOne({
      where: [
        {
          id,
        },
      ],
    });
  }
}
