import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { Match } from './match.entity';
import { MatchService } from './match.service';

import { GetLatestTeamMatchesArgs } from './dto/args/get-latest-team-matches.args';
import { GetMatchArgs } from './dto/args/get-match.args';
import { CreateMatchInput } from './dto/input/create-match.input';
import { FinishMatchInput } from './dto/input/finish-match.input';
import { ITeamRPCService, GetAllMatchesResponse } from './match.interface';
import { GetAllMatchesArgs } from './dto/args/get-all-matches.args';

import { NotFoundException } from '../exceptions/not-found.exception';
import { BadRequestException } from '../exceptions/bad-request.exception';

@Resolver(() => Match)
export class MatchResolver {
  private teamRPCService: ITeamRPCService;

  constructor(
    private readonly matchService: MatchService,
    @Inject('TEAMS_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.teamRPCService =
      this.client.getService<ITeamRPCService>('TeamRPCService');
  }

  @Query(() => [Match], { name: 'latestTeamMatches' })
  async getLatestTeamMatches(
    @Args() getLatestTeamMatchesArgs: GetLatestTeamMatchesArgs,
  ): Promise<Match[]> {
    const matches = await this.matchService.getLatestTeamMatches(
      getLatestTeamMatchesArgs,
    );

    return Promise.all(
      matches.map(async (match) => {
        const teamsResponse = await this.teamRPCService
          .getMatchTeams({
            environment: getLatestTeamMatchesArgs.environment,
            teamIds: [match.team1, match.team2],
            toGetPlayers: false,
          })
          .toPromise();

        const { data: teams } = teamsResponse;

        return {
          ...match,
          teams,
        };
      }),
    );
  }

  @Query(() => Match, { name: 'match' })
  async getMatch(@Args() getMatchArgs: GetMatchArgs): Promise<Match> {
    return this.matchService.get(getMatchArgs);
  }

  @Query(() => GetAllMatchesResponse, { name: 'matches' })
  async getMatches(
    @Args() getAllMatchesArgs: GetAllMatchesArgs,
  ): Promise<GetAllMatchesResponse> {
    const paginationOptions = {
      limit: getAllMatchesArgs.limit,
      page: getAllMatchesArgs.page,
    };
    const matchesData = await this.matchService.getAll(
      getAllMatchesArgs,
      paginationOptions,
    );

    const matches = await Promise.all(
      matchesData.data.map(async (match) => {
        const teamsResponse = await this.teamRPCService
          .getMatchTeams({
            environment: getAllMatchesArgs.environment,
            teamIds: [match.team1, match.team2],
            toGetPlayers: false,
          })
          .toPromise();

        const { data: teams } = teamsResponse;

        return {
          ...match,
          teams,
        };
      }),
    );

    return {
      ...matchesData,
      data: matches,
    };
  }

  @Mutation(() => Match)
  createMatch(
    @Args('createMatchData')
    createMatchInput: CreateMatchInput,
  ): Promise<Match> {
    try {
      return this.matchService.create(createMatchInput);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Mutation(() => Match)
  finishMatch(
    @Args('finishMatchData')
    finishMatchInput: FinishMatchInput,
  ): Promise<Match> {
    try {
      return this.matchService.finish(finishMatchInput);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
