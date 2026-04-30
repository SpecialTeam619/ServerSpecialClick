import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '../generated/prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: Prisma.UserWhereUniqueInput,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(email);

    if (!user || user.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload: { sub: string; email: string } = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const user = await this.userService.createUser({
      email: registerDto.email,
      name: registerDto.name,
      password: registerDto.password,
    });

    const payload: { sub: string; email: string } = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
