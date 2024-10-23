import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ActivationDto, RegisterInput, LoginDto } from './dto/user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context: { res: Response },
  ): Promise<User> {
    if (
      !registerInput.email ||
      !registerInput.password ||
      !registerInput.phone_number
    ) {
      throw new BadRequestException('Бүх талбарыг бөглөнө үү!');
    }
    const { user, activationToken } = await this.userService.register(
      registerInput,
      context.res,
    );
    return { user, activationToken } as any; // as any нэмж түр зуур алдаа арилгав
  }

  @Mutation(() => User)
  async activateUser(
    @Args('activationInput') activationInput: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<User> {
    const { user } = await this.userService.activationUser(
      activationInput,
      context.res,
    );
    return user;
  }

  @Mutation(() => User)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ): Promise<User> {
    return await this.userService.login(loginDto);
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
