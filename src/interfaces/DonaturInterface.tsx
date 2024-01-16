export interface DonaturInterface {
    id: number
    foreign_id: number
    type: string
    fullname: string
    amount: number
    message: string
    created_at: string
    updated_at: string
    created_at_for_humans: string
}