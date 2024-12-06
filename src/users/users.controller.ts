import {
  Controller,
  Post,
  Body,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserInfoDto } from './dto/user-info.dto';

@Controller('users')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
        enableImplicitConversion: true,
    },
    errorHttpStatusCode: 400,
  })
)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async create(@Body() signUpDto: SignUpDto): Promise<UserInfoDto> {
    if (await this.usersService.findUserByUsername(signUpDto.username)) {
      throw new HttpException('Used Username', 400);
    }

    if (await this.usersService.findUserByEmail(signUpDto.email)) {
      throw new HttpException('Used Email', 400);
    }

    if (await this.usersService.findUserByPhoneNumber(signUpDto.phoneNumber)) {
      throw new HttpException('Used Phone Numer', 400);
    }

    return await this.usersService.createUser(signUpDto);
  }
}