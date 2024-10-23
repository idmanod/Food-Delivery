import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { LoginDto, RegisterInput, ActivationDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { User } from './entities/user.entity';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  //register user service
  async register(
    registerInput: RegisterInput,
    response: Response,
  ): Promise<{
    user: User;
    activationToken: { token: string; activationCode: string };
  }> {
    const { name, email, password, phone_number } = registerInput;

    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExist) {
      throw new BadRequestException(
        'Энэ имэйлтэй хэрэглэгч бүртгэгдсэн байна!',
      );
    }
    const isPhoneNumberExist = await this.prisma.user.findFirst({
      where: {
        phone_number,
      },
    });

    if (isPhoneNumberExist) {
      throw new BadRequestException(
        'Энэ дугаартай хэрэглэгч бүртгэгдсэн байна!',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: name || null, // Хэрэв name null байвал хоосон string-ээр орлуулах
        email,
        password: hashedPassword,
        phone_number,
      },
    });

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;

    await this.emailService.sendMail({
      to: email,
      subject: 'Бүртгэлээ баталгаажуулна уу!',
      template: './activation-mail',
      context: { name, activationCode },
    });

    return { user, activationToken };
  }

  // create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }

  //activation user
  async activationUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser = this.jwtService.verify(activationToken, {
      secret: this.configService.get<string>('ACTIVATION_SECRET'),
    } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Идэвхжүүлэх код буруу байна!');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      throw new BadRequestException('User already exists!');
    }

    const user = await this.prisma.user.create({
      data: { name, email, password, phone_number },
    });

    return { user, response };
  }

  //login service
  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    // Нэвтрэх логикоо энд хэрэгжүүлнэ
    // Жишээ нь:
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Буруу мэдээлэл оруулсан байна');
    }
    return user;
  }

  //get all users service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
