import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './error.types';

@ObjectType()
export class RegisterResponse {
  @Field(() => String, { nullable: true })
  activation_token?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
