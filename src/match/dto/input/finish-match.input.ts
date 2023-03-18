import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { MATCH_ACTION_TYPES } from '../../../config/constants';

@InputType()
export class Action {
  @Field()
  @IsNotEmpty()
  player: string;

  @Field({ nullable: true })
  team: string | null;

  @Field()
  @IsNotEmpty()
  type: MATCH_ACTION_TYPES;

  @Field()
  @IsNotEmpty()
  minute: number;
}

@InputType()
export class Participant {
  @Field()
  @IsNotEmpty()
  player: string;

  @Field()
  @IsNotEmpty()
  team: string;
}

@InputType()
export class FinishMatchInput {
  @Field()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsNotEmpty()
  environment: string;

  @Field({ nullable: true })
  winner: string | null;

  @Field()
  @IsNotEmpty()
  team1Goals: number;

  @Field()
  @IsNotEmpty()
  team2Goals: number;

  @Field(() => [Action], { nullable: true })
  actions: Action[] = [];

  @Field(() => [Participant], { nullable: true })
  participants: Participant[] = [];
}
