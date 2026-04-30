import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

export class User {
  id: any;
  constructor(
    private _password: string,
    private readonly _email: string,
    private readonly _name: string,
    passwordHash?: string,
  ) {
    if (passwordHash) {
      this._password = passwordHash;
    }
  }
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  get email(): string {
    return this._email;
  }

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  get name(): string {
    return this._name;
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
