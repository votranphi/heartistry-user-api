import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Req,
  Get,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Request } from 'express';
import { JwtGuard } from './guards/jwt.guard';
import { MailService } from 'src/mail/mail.service';
import { OtpsService } from 'src/otps/otps.service';
import { OtpDto } from './dto/otp.dto';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { AdminGuard } from './guards/admin.guard';
import { User } from './entities/user.entity';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateDto } from './dto/update.dto';
import { AdminUpdateDto } from './dto/admin-update.dto';
import { PasswordDto } from './dto/password.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly otpsService: OtpsService,
  ) { }



  @ApiOperation({
    summary: 'Sign up new account and get OTP'
  })
  @ApiBadRequestResponse({
    description: 'Username, email, password have been used or invalid',
    example: new BadRequestException('Message').getResponse()
  })
  @ApiOkResponse({
    description: 'Notify that the OTP was sent successfully',
    example: {
      message: 'OTP was sent to your email',
      statusCode: HttpStatus.OK,
    }
  })
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
  @Post('signup')
  async create(@Body() signUpDto: SignUpDto): Promise<any> {
    if (await this.usersService.findUserByUsername(signUpDto.username)) {
      throw new BadRequestException('Existed username');
    }

    if (await this.usersService.findUserByEmail(signUpDto.email)) {
      throw new BadRequestException('Existed email');
    }

    if (await this.usersService.findUserByPhoneNumber(signUpDto.phoneNumber)) {
      throw new BadRequestException('Existed phone number');
    }

    const foundOtp = await this.otpsService.findOtpByUsername(signUpDto.username);

    let savedOtp = null;

    if (!foundOtp) {
      savedOtp = await this.otpsService.createOtp(signUpDto.username);
    } else {
      savedOtp = await this.otpsService.updateOtp(signUpDto.username);
    }

    this.mailService.sendOtpVerificationCode(signUpDto.username, signUpDto.email, savedOtp.otp);

    return {
      message: 'OTP was sent to your email',
      statusCode: HttpStatus.OK,
    };
  }



  @ApiOperation({
    summary: 'Verify received OTP'
  })
  @ApiBadRequestResponse({
    description: "OTP was not found, incorrect, or username's taken",
    example: new BadRequestException('Message').getResponse()
  })
  @ApiOkResponse({
    description: 'Account has been signed up and added to database',
    type: User
  })
  @Post('otp_verification')
  async otpVerification(@Body() otpDto: OtpDto): Promise<any> {
    const foundOtp = await this.otpsService.findOtpByUsername(otpDto.username);

    const foundUser = await this.usersService.findUserByUsername(otpDto.username);

    if (foundUser) {
      throw new BadRequestException("Username's already taken");
    }

    if (!foundOtp) {
      throw new BadRequestException('OTP not found');
    }

    if (foundOtp.otp !== otpDto.otp) {
      throw new BadRequestException('Incorrect OTP');
    }

    if (foundOtp.expireTime <= Date.now() / 1000) {
      throw new BadRequestException('OTP expired');
    }

    const { otp, ...signUpDto } = otpDto;
    return await this.usersService.createUser(signUpDto);
  }



  @ApiOperation({
    summary: "Resend new password to user's email"
  })
  @ApiBadRequestResponse({
    description: 'User was not found, wrong email or wrong phone number',
    example: new BadRequestException('Message').getResponse()
  })
  @ApiOkResponse({
    description: 'New password was sent to email',
    example: {
      message: 'New password was sent to your email',
      statusCode: HttpStatus.OK,
    }
  })
  @Post('password_recovery')
  async passwordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto): Promise<any> {
    const foundUser = await this.usersService.findUserByUsername(passwordRecoveryDto.username);

    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    if (foundUser.email !== passwordRecoveryDto.email) {
      throw new BadRequestException('Wrong email');
    }

    if (foundUser.phoneNumber !== passwordRecoveryDto.phoneNumber) {
      throw new BadRequestException('Wrong phone number');
    }

    const newPassword = await this.usersService.updatePasswordRandomly(passwordRecoveryDto.username);

    this.mailService.sendPasswordRecovery(passwordRecoveryDto.username, passwordRecoveryDto.email, newPassword);

    return {
      message: 'New password was sent to your email',
      statusCode: HttpStatus.OK,
    };
  }



  @ApiOperation({
    summary: 'Get your information'
  })
  @ApiOkResponse({
    description: "Get account's information successfully",
    type: User
  })
  @ApiUnauthorizedResponse({
    description: 'Access token was not given',
    example: new UnauthorizedException().getResponse()
  })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtGuard)
  async info(@Req() req: Request): Promise<User> {
    const { id } = req.user as { id: number; username: string; role: string };
    return await this.usersService.findUserById(id);
  }



  @ApiOperation({
    summary: "Get all users' information (Admin only)"
  })
  @ApiOkResponse({
    description: "Get all users account information successfully",
    type: [User]
  })
  @ApiUnauthorizedResponse({
    description: 'Access token was not given',
    example: new UnauthorizedException().getResponse()
  })
  @ApiForbiddenResponse({
    description: "Given token wasn't from an admin",
    example: new ForbiddenException("Access denied: Admins only").getResponse()
  })
  @ApiBearerAuth()
  @Get('all')
  @UseGuards(JwtGuard, AdminGuard)
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }



  @ApiOperation({
    summary: "Update user's information"
  })
  @ApiOkResponse({
    description: "Update user's information successfully",
    type: User
  })
  @ApiBadRequestResponse({
    description: 'Username, email, password have been used or invalid',
    example: new BadRequestException('Message').getResponse()
  })
  @ApiUnauthorizedResponse({
    description: 'Access token was not given',
    example: new UnauthorizedException().getResponse()
  })
  @ApiBearerAuth()
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
  @Patch('me')
  @UseGuards(JwtGuard)
  async updateMyInformation(@Req() req: Request, @Body() updateDto: UpdateDto): Promise<User> {
    if (await this.usersService.findUserByEmail(updateDto.email)) {
      throw new BadRequestException('Existed email');
    }

    if (await this.usersService.findUserByPhoneNumber(updateDto.phoneNumber)) {
      throw new BadRequestException('Existed phone number');
    }

    const { id } = req.user as { id: number; username: string; role: string };
    return await this.usersService.updateUserInformation(id, updateDto);
  }



  @ApiOperation({
    summary: "Update user's information (Admin only)"
  })
  @ApiOkResponse({
    description: "Update user's information successfully",
    type: User
  })
  @ApiBadRequestResponse({
    description: 'Username, email, password have been used or invalid',
    example: new BadRequestException('Message').getResponse()
  })
  @ApiUnauthorizedResponse({
    description: 'Access token was not given',
    example: new UnauthorizedException().getResponse()
  })
  @ApiForbiddenResponse({
    description: "Given token wasn't from an admin",
    example: new ForbiddenException("Access denied: Admins only").getResponse()
  })
  @ApiBearerAuth()
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
  @Patch(':id')
  @UseGuards(JwtGuard, AdminGuard)
  async updateUsersInformation(@Param('id') id: number, @Body() adminUpdateDto: AdminUpdateDto): Promise<User> {
    if (await this.usersService.findUserByUsername(adminUpdateDto.username)) {
      throw new BadRequestException('Existed username');
    }

    if (await this.usersService.findUserByEmail(adminUpdateDto.email)) {
      throw new BadRequestException('Existed email');
    }

    if (await this.usersService.findUserByPhoneNumber(adminUpdateDto.phoneNumber)) {
      throw new BadRequestException('Existed phone number');
    }

    return await this.usersService.updateUserInformationForAdmin(id, adminUpdateDto);
  }



  @ApiOperation({
    summary: "Delete user's account (Admin only)"
  })
  @ApiOkResponse({
    description: "Delete user's account successfully",
    type: User
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    example: new NotFoundException('User not found').getResponse()
  })
  @ApiUnauthorizedResponse({
    description: 'Access token was not given',
    example: new UnauthorizedException().getResponse()
  })
  @ApiForbiddenResponse({
    description: "Given token wasn't from an admin",
    example: new ForbiddenException("Access denied: Admins only").getResponse()
  })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  async deleteUserAccount(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.deleteUserById(id);
    return user;
  }



  @ApiBearerAuth()
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
  @Post('password')
  @UseGuards(JwtGuard)
  async updatePassword(@Req() req: Request, @Body() passwordDto: PasswordDto): Promise<User> {
    const { id } = req.user as { id: number; username: string; role: string };

    return await this.usersService.updatePassword(id, passwordDto.password);
  }
}