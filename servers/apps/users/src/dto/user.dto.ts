import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field(() => String, { nullable: true })
  @IsString({ message: 'Нэр нь нэг мөр байх ёстой.' })
  name?: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Нууц үг шаардлагатай.' })
  @MinLength(8, { message: 'Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.' })
  password: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Имэйл хаяг шаардлагатай.' })
  @IsEmail({}, { message: 'Имэйл хаяг буруу байна.' })
  email: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Утасны дугаар шаардлагатай.' })
  @IsString({ message: 'Утасны дугаар текст байх ёстой.' })
  phone_number: string;
}

@InputType()
export class ActivationDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Активацийн токен шаардлагатай.' })
  activationToken: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Активацийн код шаардлагатай.' })
  activationCode: string;
}

@InputType()
export class LoginDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Имэйл хаяг шаардлагатай.' })
  @IsEmail({}, { message: 'Имэйл хаяг хүчинтэй байх ёстой.' })
  email: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Нууц үг шаардлагатай.' })
  password: string;
}
