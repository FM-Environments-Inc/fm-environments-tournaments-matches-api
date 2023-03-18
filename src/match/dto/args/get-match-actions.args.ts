import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { Match } from '../../match.entity';

@ArgsType()
export class GetMatchActionsArgs {
  @IsNotEmpty()
  @Field()
  match: Match;
}
