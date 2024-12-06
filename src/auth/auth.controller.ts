import { Body, Controller, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}  
    @Post('token')
    @UseGuards(LocalGuard)
    async login(@Req() req: Request) {
        return req.user;
    }
}
