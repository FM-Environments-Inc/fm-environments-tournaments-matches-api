import { InputType, Field } from '@nestjs/graphql';

import { IsNotEmpty } from 'class-validator';

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
}
