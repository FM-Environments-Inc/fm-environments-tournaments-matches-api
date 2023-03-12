import { InputType, Field } from '@nestjs/graphql';

import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMatchInput {
  @Field()
  @IsNotEmpty()
  environment: string;

  @Field()
  @IsNotEmpty()
  team1: string;

  @Field()
  @IsNotEmpty()
  team2: string;

  team1Goals?: 0;

  team2Goals?: 0;
}
