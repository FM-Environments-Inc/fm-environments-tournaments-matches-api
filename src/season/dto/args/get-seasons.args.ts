import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetSeasonsArgs {
  @Field()
  @IsNotEmpty()
  environment: string;
}
