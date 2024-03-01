import { IUser } from "./IUser";

export interface IBill{
    id: number,
    date: string,
    user: IUser
}