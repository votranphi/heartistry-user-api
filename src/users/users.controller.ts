import {
  Controller,
  Post,
  Body,
  HttpException,
  UsePipes,
  ValidationPipe,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { MailService } from 'src/mail/mail.service';
import { OtpsService } from 'src/otps/otps.service';
import { User } from './entities/user.entity';

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
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly otpsService: OtpsService,
  ) {}

  @Post('signup')
  async create(@Body() signUpDto: SignUpDto): Promise<UserInfoDto> {
    if (await this.usersService.findUserByUsername(signUpDto.username)) {
      throw new HttpException('Used Username', 400);
    }

    if (await this.usersService.findUserByEmail(signUpDto.email)) {
      throw new HttpException('Used Email', 400);
    }

    if (await this.usersService.findUserByPhoneNumber(signUpDto.phoneNumber)) {
      throw new HttpException('Used Phone Number', 400);
    }

    const otp = await this.otpsService.createOtp(signUpDto.username);

    this.mailService.sendOtpVerificationCode(signUpDto.username, signUpDto.email, otp.otp);

    return await this.usersService.createUser(signUpDto);
  }

  @Get('')
  @UseGuards(JwtGuard)
  async info(@Req() req: Request) {
    return req.user;
  }
}