import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { OtpsModule } from 'src/otps/otps.module';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule, OtpsModule, AuditLogsModule],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService]
})
export class UsersModule {}