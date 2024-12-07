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
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { MailService } from 'src/mail/mail.service';
import { OtpsService } from 'src/otps/otps.service';
import { OtpDto } from './dto/otp.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly otpsService: OtpsService,
  ) {}

  @Post('signup')
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
  async create(@Body() signUpDto: SignUpDto): Promise<any> {
    if (await this.usersService.findUserByUsername(signUpDto.username)) {
      throw new HttpException('Used Username', 400);
    }

    if (await this.usersService.findUserByEmail(signUpDto.email)) {
      throw new HttpException('Used Email', 400);
    }

    if (await this.usersService.findUserByPhoneNumber(signUpDto.phoneNumber)) {
      throw new HttpException('Used Phone Number', 400);
    }

    const foundOtp = await this.otpsService.findOtpByUsername(signUpDto.username);

    let savedOtp = null;

    if (!foundOtp) {
      savedOtp = await this.otpsService.createOtp(signUpDto.username);
    } else {
      savedOtp = await this.otpsService.updateOtp(signUpDto.username);
    }

    this.mailService.sendOtpVerificationCode(signUpDto.username, signUpDto.email, savedOtp.otp);

    throw new HttpException('OTP Sent', HttpStatus.OK);
  }

  @Post('otp_verification')
  async otpVerification(@Body() otpDto: OtpDto): Promise<any> {
    const foundOtp = await this.otpsService.findOtpByUsername(otpDto.username);

    if (!foundOtp) {
      throw new HttpException('OTP Not Found', HttpStatus.BAD_REQUEST);
    }

    if (foundOtp.otp !== otpDto.otp) {
      throw new HttpException('Incorrect OTP', HttpStatus.BAD_REQUEST);
    }

    if (foundOtp.expireTime <= Date.now() / 1000) {
      throw new HttpException('OTP Expired', HttpStatus.BAD_REQUEST);
    }

    const { otp, ...signUpDto } = otpDto;
    return await this.usersService.createUser(signUpDto);
  }

  @Get('')
  @UseGuards(JwtGuard)
  async info(@Req() req: Request) {
    return req.user;
  }
}