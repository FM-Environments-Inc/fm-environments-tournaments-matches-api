import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetLatestTeamMatchesArgs {
  @IsNotEmpty()
  @Field()
  teamId: number;

  @Field({ nullable: true })
  count?: number;
}
