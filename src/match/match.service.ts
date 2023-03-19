import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, DataSource } from 'typeorm';

import { Match } from './match.entity';
import { SeasonService } from '../season/season.service';
import { MatchActionService } from './match-action.service';
import { MatchAction } from './match-action.entity';

import { GetLatestTeamMatchesArgs } from './dto/args/get-latest-team-matches.args';
import { GetMatchArgs } from './dto/args/get-match.args';
import { GetAllMatchesArgs } from './dto/args/get-all-matches.args';
import { CreateMatchInput } from './dto/input/create-match.input';
import { FinishMatchInput } from './dto/input/finish-match.input';
import { SORT_WAY } from '../config/constants';
import { IPagination } from '../common/types.d';
import { GetAllMatchesResponse } from './match.interface';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectRepository(MatchAction) private matchActionRepository: Repository<MatchAction>,
    private seasonService: SeasonService,
    private matchActionService: MatchActionService,
    private readonly dataSource: DataSource,
  ) {}

  public async getLatestTeamMatches(
    getLatestTeamMatchesArgs: GetLatestTeamMatchesArgs,
  ): Promise<Match[]> {
    const { teamId, count, environment } = getLatestTeamMatchesArgs;

    const DEFAULT_TAKE = 5;

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
    const { actions, environment, participants = [] } = finishMatchInput;

    const match = await this.matchRepository.findOne({
      where: {
        id: finishMatchInput.id,
      },
    });

    if (match) {
      if (match.finishedAt) {
        throw new Error('Match is already finished');
      }

      let matchActions: MatchAction[] = actions.map((action) => ({
        ...action,
        environment,
        match,
        matchId: match.id,
      }));

      const initialParticipationActions = participants.map((participant) => ({
        ...participant,
        environment,
        match,
        matchId: match.id,
      }));

      const participationActions =
        this.matchActionService.getParticipationActions(
          initialParticipationActions,
        );

      matchActions = [...participationActions, ...matchActions];

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      try {
        let result = null;

        await queryRunner.manager.getRepository(MatchAction).save(matchActions);
        result = await queryRunner.manager.getRepository(Match).save({
          ...match,
          team1Goals: finishMatchInput.team1Goals,
          team2Goals: finishMatchInput.team2Goals,
          winner: finishMatchInput.winner,
          finishedAt: new Date(),
        });

        await queryRunner.commitTransaction();

        return result;
      } catch (error) {
        console.log(error);
        await queryRunner.rollbackTransaction();
        throw new Error(error.message);
      } finally {
        await queryRunner.release();
      }
    }

    throw new Error('Match not found');
  }

  public async getAll(
    getAllMatchesArgs: GetAllMatchesArgs,
    paginationOptions: IPagination,
  ): Promise<GetAllMatchesResponse> {
    const { environment } = getAllMatchesArgs;
    const { page, limit } = paginationOptions;

    const skip: number = (page - 1) * limit;

    const matches = await this.matchRepository.find({
      where: [
        {
          environment,
        },
      ],
      order: {
        createdAt: SORT_WAY.DESC,
      },
      skip,
      take: limit,
    });

    const total = await this.matchRepository.count({
      where: {
        environment,
      },
    });

    return {
      data: matches,
      limit,
      page,
      total,
    };
  }

  public async get(getMatchArgs: GetMatchArgs): Promise<Match> {
    const { id } = getMatchArgs;

    const match = await this.matchRepository.findOne({
      where: [
        {
          id,
        },
      ],
    });
    const actions = await this.matchActionService.get({ match });
    return {
      ...match,
      actions,
    };
  }
}
