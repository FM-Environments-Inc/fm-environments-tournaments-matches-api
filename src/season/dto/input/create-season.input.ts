import { InputType, Field } from '@nestjs/graphql';

import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSeasonInput {
  @Field()
  @IsNotEmpty()
  environment: string;
}
