import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GetCurrentSeasonArgs } from './dto/args/get-season.args';
import { GetSeasonsArgs } from './dto/args/get-seasons.args';
import { CreateSeasonInput } from './dto/input/create-season.input';
import { FinishSeasonInput } from './dto/input/finish-season.input';

import { Season } from './season.entity';
import { SeasonService } from './season.service';

@Resolver(() => Season)
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @Query(() => Season, { name: 'currentSeason', nullable: true })
  getCurrentSeason(
    @Args() getCurrentSeasonArgs: GetCurrentSeasonArgs,
  ): Promise<Season> {
    return this.seasonService.get(getCurrentSeasonArgs);
  }

  @Query(() => [Season], { name: 'environments' })
  getEnvironments(@Args() getSeasonsArgs: GetSeasonsArgs): Promise<Season[]> {
    return this.seasonService.getAll(getSeasonsArgs);
  }

  @Mutation(() => Season)
  createEnvironment(
    @Args('createSeasonData')
    createSeasonInput: CreateSeasonInput,
  ): Promise<Season> {
    return this.seasonService.create(createSeasonInput);
  }

  @Mutation(() => Season)
  finishSeason(
    @Args('finishSeasonData')
    finishSeasonInput: FinishSeasonInput,
  ): Promise<Season> {
    return this.seasonService.finish(finishSeasonInput);
  }
}
