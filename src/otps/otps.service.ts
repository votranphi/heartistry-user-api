import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';

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

        // create new one if otp isn't in the database
        if (!otp) {
            return await this.createOtp(username);
        }

        // update the otp, createTime and expireTime if otp is in the database
        otp.otp = this.generateRandomSixDigitString();
        otp.expireTime = Math.floor(Date.now() / 1000) + this.OTP_EXPIRE_TIME;
        
        return await this.otpsRepository.save(otp);
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
