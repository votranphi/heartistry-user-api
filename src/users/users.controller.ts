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
  Query,
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
import { AvatarDto } from './dto/avatar.dto';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { PaginationDto } from './dto/pagination.dto';
import { AddDto } from './dto/add.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly otpsService: OtpsService,
    private readonly auditLogsService: AuditLogsService,
  ) { }



  @ApiOperation({
    summary: 'Add a new user (Admin only)'
  })
  @ApiBadRequestResponse({
    description: "Username, email or phone number has been taken",
    example: new BadRequestException('Message').getResponse()
  })
  @ApiOkResponse({
    description: 'Account has been signed up and added to database',
    type: User
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, AdminGuard)
  @Post('add')
  async createAdmin(@Req() req: Request, @Body() addDto: AddDto): Promise<any> {
    if (await this.usersService.findUserByUsername(addDto.username)) {
      throw new BadRequestException('Existed username');
    }

    if (await this.usersService.findUserByEmail(addDto.email)) {
      throw new BadRequestException('Existed email');
    }

    if (await this.usersService.findUserByPhoneNumber(addDto.phoneNumber)) {
      throw new BadRequestException('Existed phone number');
    }

    const savedUser = await this.usersService.createUserForAdmin(addDto);

    const { id, username, role } = req.user as { id: number, username: string, role: string }
    // make audit log
    this.auditLogsService.save({
      action: "CREATE",
      entity: "User",
      entityId: savedUser.id,
      userId: id,
      username: username,
      role: role,
      details: "A user's account has been created by an Admin'",
    });

    return savedUser;
  }



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
  async create(@Req() req: Request, @Body() signUpDto: SignUpDto): Promise<any> {
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

    // make audit log
    this.auditLogsService.save({
      action: "SIGNUP",
      entity: "User",
      entityId: -1,
      userId: -1,
      username: signUpDto.username,
      role: "user",
      details: "A user has been signed up and waiting for email verification",
    });

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
  async otpVerification(@Req() req: Request, @Body() otpDto: OtpDto): Promise<any> {
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

    const savedUser = await this.usersService.createUser(signUpDto);

    // make audit log
    this.auditLogsService.save({
      action: "CREATE",
      entity: "User",
      entityId: savedUser.id,
      userId: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
      details: "A user's account has been created'",
    });

    return savedUser;
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
  async passwordRecovery(@Req() req: Request, @Body() passwordRecoveryDto: PasswordRecoveryDto): Promise<any> {
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

    // make audit log
    this.auditLogsService.save({
      action: "UPDATE",
      entity: "User",
      entityId: -1,
      userId: -1,
      username: passwordRecoveryDto.username,
      role: 'user',
      details: "A user's password has been changed (randomly)",
    });

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
    summary: "Get all users' information with pagination (Admin only)"
  })
  @ApiOkResponse({
    description: "Get paginated users account information successfully",
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
  @UseGuards(JwtGuard, AdminGuard)
  @Get('all/pagination')
  async getPaginatedUsers(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findPaginatedUsers(paginationDto);
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
    const { id } = req.user as { id: number; username: string; role: string };

    const foundUserByEmail = await this.usersService.findUserByEmail(updateDto.email);

    if (foundUserByEmail.id !== id) {
      throw new BadRequestException('Existed email');
    }

    const foundUserByPhoneNumber = await this.usersService.findUserByPhoneNumber(updateDto.phoneNumber);

    if (foundUserByPhoneNumber.id !== id) {
      throw new BadRequestException('Existed phone number');
    }

    const updatedUser = await this.usersService.updateUserInformation(id, updateDto);

    // make audit log
    this.auditLogsService.save({
      action: "UPDATE",
      entity: "User",
      entityId: updatedUser.id,
      userId: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
      details: "A user has updated his/her information",
    });

    return updatedUser;
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
  async updateUsersInformation(@Req() req: Request, @Param('id') id: number, @Body() adminUpdateDto: AdminUpdateDto): Promise<User> {
    if (!(await this.usersService.findUserById(id))) {
      throw new NotFoundException('User not found');
    }

    const foundUserByEmail = await this.usersService.findUserByEmail(adminUpdateDto.email);

    if (foundUserByEmail && foundUserByEmail.id !== id) {
      throw new BadRequestException('Existed email');
    }

    const foundUserByPhoneNumber = await this.usersService.findUserByPhoneNumber(adminUpdateDto.phoneNumber);

    if (foundUserByPhoneNumber && foundUserByPhoneNumber.id !== id) {
      throw new BadRequestException('Existed phone number');
    }

    const updatedUser = await this.usersService.updateUserInformationForAdmin(id, adminUpdateDto);

    const userMadeChange = req.user as { id: number; username: string; role: string };
    // make audit log
    this.auditLogsService.save({
      action: "UPDATE",
      entity: "User",
      entityId: updatedUser.id,
      userId: userMadeChange.id,
      username: userMadeChange.username,
      role: userMadeChange.role,
      details: "An admin has changed a user's information",
    });

    return updatedUser;
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
  async deleteUserAccount(@Req() req: Request, @Param('id') id: number): Promise<User> {
    const deletedUser = await this.usersService.findUserById(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    const userMadeChange = req.user as { id: number; username: string; role: string };
    // make audit log
    this.auditLogsService.save({
      action: "DELETE",
      entity: "User",
      entityId: deletedUser.id,
      userId: userMadeChange.id,
      username: userMadeChange.username,
      role: userMadeChange.role,
      details: "An admin has deleted a user's account",
    });

    await this.usersService.deleteUserById(id);
    return deletedUser;
  }



  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update user's password"
  })
  @ApiUnauthorizedResponse({
    description: 'Access token was not given or old password was incorrect',
    example: new UnauthorizedException().getResponse()
  })
  @ApiOkResponse({
    description: "Change password successfully",
    type: User
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
  @Post('password')
  @UseGuards(JwtGuard)
  async updatePassword(@Req() req: Request, @Body() passwordDto: PasswordDto): Promise<User> {
    const { id } = req.user as { id: number; username: string; role: string };

    const user = await this.usersService.findUserById(id);

    if (user.password !== passwordDto.password) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const updatedUser = await this.usersService.updatePassword(id, passwordDto.newPassword);

    // make audit log
    this.auditLogsService.save({
      action: "UPDATE",
      entity: "User",
      entityId: updatedUser.id,
      userId: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
      details: "A user has changed his/her password",
    });

    return updatedUser;
  }



  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update user's avatar"
  })
  @ApiOkResponse({
    description: "Change avatar successfully",
    type: User
  })
  @Post('avatar')
  @UseGuards(JwtGuard)
  async updateAvatar(@Req() req: Request, @Body() avatarDto: AvatarDto): Promise<User> {
    const { id } = req.user as { id: number; username: string; role: string };

    const updatedUser = await this.usersService.updateAvatar(id, avatarDto);

    // make audit log
    this.auditLogsService.save({
      action: "UPDATE",
      entity: "User",
      entityId: updatedUser.id,
      userId: updatedUser.id,
      username: updatedUser.username,
      role: updatedUser.role,
      details: "A user has changed his/her avatar",
    });

    return updatedUser;
  }
}