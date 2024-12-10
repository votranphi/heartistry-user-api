import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService) {}

    async validateUser({ username, password }: AuthPayloadDto) {
        const foundUser = await this.usersService.findUserByUsername(username);

        if (!foundUser)
            return null;

        if (password === foundUser.password) {
            const { password, fullname, email, phoneNumber, dob, gender, createAt, updateAt, ...user } = foundUser;
            return { access_token: this.jwtService.sign(user) };
        }

        return null;
    }
}
