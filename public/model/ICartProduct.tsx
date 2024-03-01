import { IProduct } from "./IProduct"
import { IUser } from "./IUser"

export interface ICartProduct{
    id: number,
    product: IProduct,
    user: IUser,
    quantity: number
}