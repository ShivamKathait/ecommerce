export declare class CheckoutItemDto {
    productId: number;
    quantity: number;
}
export declare class CheckoutDto {
    items: CheckoutItemDto[];
    note?: string;
}
