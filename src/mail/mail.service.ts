import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpVerificationCode(username: string, email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'OTP Verification Code',
      template: './otp',
      context: {
        username: username,
        otp: otp,
      },
    });
  }

  async sendPasswordRecovery(username: string, email: string, newPassword: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Recovery',
      template: './password_recovery',
      context: {
        username: username,
        newPassword: newPassword,
      },
    });
  }
}
