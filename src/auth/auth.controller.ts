import { Body, Controller, HttpException, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOkResponse({
        description: 'Ok: get access token successfully',
        example: `{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJ2b3RyYW5waGkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM4Mzg4MzEsImV4cCI6MTczMzg0MjQzMX0.5fcHi3sZO4RUNV31OvlRUKFkiZjDMCgKqzZHvZ-vt8s" }`
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid username or password',
        example: new UnauthorizedException().getResponse()
    })
    @Post('token')
    @UseGuards(LocalGuard)
    async login(@Req() req: Request) {
        return req.user;
    }
}
