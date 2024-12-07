import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class OtpsService {
    private OTP_EXPIRE_TIME = 300 // in second

    constructor(
        @InjectRepository(Otp) private readonly otpsRepository: Repository<Otp>,
    ) {}

    async createOtp(username: string): Promise<Otp> {
        const newOtp: Otp = new Otp();

        newOtp.username = username;
        newOtp.otp = this.generateRandomSixDigitString();
        newOtp.expireTime = Math.floor(Date.now() / 1000) + this.OTP_EXPIRE_TIME;

        return await this.otpsRepository.save(newOtp);
    }

    async updateOtp(username: string): Promise<Otp> {
        const otp = await this.findOtpByUsername(username);

        otp.otp = this.generateRandomSixDigitString();
        otp.expireTime = Math.floor(Date.now() / 1000) + this.OTP_EXPIRE_TIME;

        await this.otpsRepository.update(otp.id, otp);

        return await this.findOtpByUsername(username);
    }

    async findOtpByUsername(username: string): Promise<Otp> {
        return await this.otpsRepository.findOne({
            where: {
                username: username
            },
          });
    }

    generateRandomSixDigitString() {
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }
}
