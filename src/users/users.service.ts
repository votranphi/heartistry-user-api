import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { use } from 'passport';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  async createUser(signUpDto: SignUpDto): Promise<UserInfoDto> {
    const user: User = new User();
    user.fullname = signUpDto.fullname;
    user.age = signUpDto.age;
    user.email = signUpDto.email;
    user.phoneNumber = signUpDto.phoneNumber;
    user.username = signUpDto.username;
    user.password = signUpDto.password;
    user.gender = signUpDto.gender;

    const {password, ...returnedUser} = await this.usersRepository.save(user);

    return returnedUser;
  }

  async updatePassword(username: string): Promise<string> {
    const foundUser = await this.findUserByUsername(username);

    foundUser.password = this.generateRandomString();

    await this.usersRepository.update(foundUser.id, foundUser);

    return foundUser.password;
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        username: username
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: email
      },
    });
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        phoneNumber: phoneNumber
      },
    });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  generateRandomString(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}