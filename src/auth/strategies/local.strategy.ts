import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super();
    }

    async validate(username: string, password: string) {
        return {
            username: username,
            password: password,
        }
    }
}