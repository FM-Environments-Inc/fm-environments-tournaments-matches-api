import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetCurrentSeasonArgs {
  @Field()
  @IsNotEmpty()
  environment: string;

  finishedAt?: null;
}
