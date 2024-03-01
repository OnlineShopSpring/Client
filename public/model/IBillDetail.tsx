import { IBill } from "./IBill";
import { IProduct } from "./IProduct";

export interface IBillDetail{
    id: number,
    price: number,
    quantity: number,
    bill: IBill,
    product: IProduct
}