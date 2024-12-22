import { Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private jwtService: JwtService,
        private auditLogsService: AuditLogsService,
        private usersService: UsersService
    ) { }

    @ApiOperation({
        summary: 'Get access token base on the provided username and password'
    })
    @ApiOkResponse({
        description: 'Ok: get access token successfully',
        example: `{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJ2b3RyYW5waGkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM4Mzg4MzEsImV4cCI6MTczMzg0MjQzMX0.5fcHi3sZO4RUNV31OvlRUKFkiZjDMCgKqzZHvZ-vt8s" }`
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid username or password; user not found',
        example: new UnauthorizedException().getResponse()
    })
    @Post('token')
    @UseGuards(LocalGuard)
    async login(@Req() req: Request) {
        const reqUserCredentials = req.user as { username: string, password: string };

        const foundUser = await this.usersService.findUserByUsername(reqUserCredentials.username);

        if (!foundUser) throw new UnauthorizedException("User not found");

        if (reqUserCredentials.password !== foundUser.password) {
            throw new UnauthorizedException("Invalid username or password");
        }

        const { password, fullname, email, phoneNumber, dob, gender, createAt, updateAt, avatarUrl, ...user } = foundUser;
        
        // make audit log
        this.auditLogsService.save({
            action: "LOGIN",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            username: user.username,
            role: user.role,
            ipAddress: req.ip,
            details: "A user has logged in",
        });
        
        return {
            access_token: this.jwtService.sign(user)
        };
    }
}
