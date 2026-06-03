import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client';

export class User {
  constructor(
    private readonly _id: string,
    private _password: string,
    private readonly _phone: string,
    private readonly _name: string,
    private readonly _role: Role,
    passwordHash?: string,
  ) {
    if (passwordHash) {
      this._password = passwordHash;
    }
  }
  get id(): string {
    return this._id;
  }

  @ApiProperty({
    example: '+79991234567',
    description: 'The phone number of the user',
  })
  get phone(): string {
    return this._phone;
  }

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  get name(): string {
    return this._name;
  }

  @ApiProperty({
    enum: Role,
    example: Role.CUSTOMER,
    description: 'The role of the user',
  })
  get role(): Role {
    return this._role;
  }

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  get password(): string {
    return this._password;
  }
  public async setPassword(pass: string, salt: number): Promise<void> {
    try {
      this._password = await bcrypt.hash(pass, salt);
    } catch (error) {
      throw new Error('Error setting password', { cause: error });
    }
  }
  public async comparePassword(pass: string): Promise<boolean> {
    try {
      return await bcrypt.compare(pass, this._password);
    } catch (error) {
      throw new Error('Error comparing password', { cause: error });
    }
  }
}
