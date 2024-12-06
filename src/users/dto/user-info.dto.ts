export class UserInfoDto {
    id: number;

    fullname: string;

    username: string;

    email: string;

    phoneNumber: string;

    age: number;

    // password: string; // do not return the password

    gender: string;

    role: string;

    createAt: Date;

    updateAt: Date;
}