import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetLatestTeamMatchesArgs {
  @IsNotEmpty()
  @Field()
  teamId: string;

  @IsNotEmpty()
  @Field()
  environment: string;

  @Field({ nullable: true })
  count?: number;
}
