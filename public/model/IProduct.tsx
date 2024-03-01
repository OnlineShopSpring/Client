import { ICategory } from "./ICategory";
import { IDiscount } from "./IDiscount";

export interface IProduct{
    id: number,
    name: string,
    price: number,
    discount: IDiscount,
    quantity: number,
    description: string,
    category: ICategory,
    image: string
}