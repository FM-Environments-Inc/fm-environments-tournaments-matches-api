import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { Match } from './match.entity';
import { MatchService } from './match.service';

import { GetLatestTeamMatchesArgs } from './dto/args/get-latest-team-matches.args';
import { GetMatchArgs } from './dto/args/get-match.args';
import { CreateMatchInput } from './dto/input/create-match.input';
import { FinishMatchInput } from './dto/input/finish-match.input';

import { NotFoundException } from '../exceptions/not-found.exception';
import { BadRequestException } from '../exceptions/bad-request.exception';

@Resolver(() => Match)
export class MatchResolver {
  constructor(private readonly matchService: MatchService) {}

  @Query(() => [Match], { name: 'latestTeamMatches' })
  async getLatestTeamMatches(
    @Args() getLatestTeamMatchesArgs: GetLatestTeamMatchesArgs,
  ): Promise<Match[]> {
    return this.matchService.getLatestTeamMatches(getLatestTeamMatchesArgs);
  }

  @Query(() => Match, { name: 'match' })
  async getMatch(@Args() getMatchArgs: GetMatchArgs): Promise<Match> {
    return this.matchService.get(getMatchArgs);
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
