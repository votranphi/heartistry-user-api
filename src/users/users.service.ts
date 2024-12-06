import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  async createUser(signUpDto: SignUpDto): Promise<User> {
    const user: User = new User();
    user.fullname = signUpDto.fullname;
    user.age = signUpDto.age;
    user.email = signUpDto.email;
    user.phoneNumber = signUpDto.phoneNumber;
    user.username = signUpDto.username;
    user.password = signUpDto.password;
    user.gender = signUpDto.gender;

    return await this.usersRepository.save(user);
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
}