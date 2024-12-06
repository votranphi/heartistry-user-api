import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() authPayloadDto: AuthPayloadDto) {
        const response = await this.authService.validateUser(authPayloadDto);

        if (!response) {
            throw new HttpException('Invalid Credentials', 401);
        }

        return response;
    }
}
