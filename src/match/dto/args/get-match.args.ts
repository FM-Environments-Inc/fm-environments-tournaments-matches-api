import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetMatchArgs {
  @IsNotEmpty()
  @Field()
  id: number;
}
