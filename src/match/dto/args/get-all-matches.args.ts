import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetAllMatchesArgs {
  @IsNotEmpty()
  @Field()
  environment: string;

  @Field({ nullable: true })
  limit: number = 20;

  @Field({ nullable: true })
  page: number = 1;
}
