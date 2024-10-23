import {
  ObjectType,
  Field,
  Directive,
  ID as GraphQLID,
  registerEnumType,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';

// Role enum-ийг GraphQL схемд бүртгэх
registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
@Directive('@key(fields: "id")')
export class Avatars {
  @Field()
  id: string;

  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  userId: string;
}

@ObjectType()
export class User {
  @Field(() => GraphQLID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => Avatars, { nullable: true })
  avatar?: Avatars | null;

  @Field(() => Role)
  role: Role;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
