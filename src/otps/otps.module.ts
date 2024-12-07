import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpsService } from './otps.service';

@Module({
    imports: [TypeOrmModule.forFeature([Otp])],
    controllers: [],
    providers: [OtpsService],
    exports: [OtpsService],
})
export class OtpsModule { }
