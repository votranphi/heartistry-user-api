import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService) {}

    async validateUser({ username, password }: AuthPayloadDto) {
        const findUser = await this.usersService.findUserByUsername(username);

        if (!findUser)
            return null;

        if (password === findUser.password) {
            const { password, fullname, email, phoneNumber, age, gender, createAt, updateAt, ...user } = findUser;
            return {
                access_token: this.jwtService.sign(user)
            };
        }

        return null;
    }
}
