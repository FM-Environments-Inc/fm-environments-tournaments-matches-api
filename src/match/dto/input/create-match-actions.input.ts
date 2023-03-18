import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { MATCH_ACTION_TYPES } from '../../../config/constants';
import { Match } from '../../match.entity';

@InputType()
export class CreateMatchActions {
  @Field()
  @IsNotEmpty()
  environment: string;

  @Field()
  @IsNotEmpty()
  type: MATCH_ACTION_TYPES;

  @Field({ nullable: true })
  match?: Match;

  @Field()
  @IsNotEmpty()
  team: string;

  @Field()
  @IsNotEmpty()
  player: string;

  @Field()
  minute: number = 0;

  @Field()
  @IsNotEmpty()
  matchId: number;
}
