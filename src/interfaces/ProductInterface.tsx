export interface ProductInterface {
    id: number
    image: string
    image_url: string
    name: string
    price: number
    created_at: string
    updated_at: string
    sales: number
    qty: number | null
    weight: number
}