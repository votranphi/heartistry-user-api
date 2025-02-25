import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import { UpdateDto } from './dto/update.dto';
import { AdminUpdateDto } from './dto/admin-update.dto';
import { AvatarDto } from './dto/avatar.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AddDto } from './dto/add.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  async createUser(signUpDto: SignUpDto): Promise<User> {
    const user: User = new User();
    user.fullname = signUpDto.fullname;
    user.dob = signUpDto.dob;
    user.email = signUpDto.email;
    user.phoneNumber = signUpDto.phoneNumber;
    user.username = signUpDto.username;
    user.password = signUpDto.password;
    user.gender = signUpDto.gender;

    return await this.usersRepository.save(user);
  }

  async createUserForAdmin(addDto: AddDto): Promise<User> {
    const user: User = new User();
    user.fullname = addDto.fullname;
    user.dob = addDto.dob;
    user.email = addDto.email;
    user.phoneNumber = addDto.phoneNumber;
    user.username = addDto.username;
    user.password = addDto.password;
    user.gender = addDto.gender;

    return await this.usersRepository.save(user);
  }

  async updatePasswordRandomly(username: string): Promise<string> {
    const foundUser = await this.findUserByUsername(username);

    foundUser.password = this.generateRandomString();

    await this.usersRepository.update(foundUser.id, foundUser);

    return foundUser.password;
  }

  async updatePassword(id: number, password: string): Promise<User> {
    const foundUser = await this.findUserById(id);

    foundUser.password = password;

    await this.usersRepository.update(id, foundUser);

    return foundUser;
  }

  async updateAvatar(id: number, avatarDto: AvatarDto): Promise<User> {
    const foundUser = await this.findUserById(id);

    foundUser.avatarUrl = avatarDto.avatarUrl;

    await this.usersRepository.update(id, foundUser);

    return foundUser;
  }

  async findUserById(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: id
      },
    });
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

  async findPaginatedUsers(paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;

    const [data, total] = await this.usersRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
    });

    return {
      response: data,
      pagination: {
        page,
        pageSize,
        total,
      },
    };
  }

  async updateUserInformation(id: number, updateDto: UpdateDto): Promise<User> {
    const foundUser = await this.findUserById(id);

    foundUser.fullname = updateDto.fullname;
    foundUser.email = updateDto.email;
    foundUser.phoneNumber = updateDto.phoneNumber;
    foundUser.dob = updateDto.dob;
    foundUser.gender = updateDto.gender;

    await this.usersRepository.update(id, foundUser);

    return foundUser;
  }

  async updateUserInformationForAdmin(id: number, adminUpdateDto: AdminUpdateDto): Promise<User> {
    const foundUser = await this.findUserById(id);

    foundUser.fullname = adminUpdateDto.fullname;
    foundUser.email = adminUpdateDto.email;
    foundUser.phoneNumber = adminUpdateDto.phoneNumber;
    foundUser.dob = adminUpdateDto.dob;
    foundUser.gender = adminUpdateDto.gender;
    foundUser.role = adminUpdateDto.role;

    await this.usersRepository.update(id, foundUser);

    return foundUser;
  }

  async deleteUserById(id: number) {
    this.usersRepository.delete(id);
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