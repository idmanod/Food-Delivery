import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field(() => [String])
  errors: string[];
}
