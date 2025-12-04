export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    duration: string | null
                    image_url: string | null
                    file_url: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    duration?: string | null
                    image_url?: string | null
                    file_url: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    duration?: string | null
                    image_url?: string | null
                    file_url?: string
                    is_active?: boolean
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    customer_email: string
                    customer_phone: string | null
                    total_amount: number
                    status: 'pending' | 'paid' | 'failed' | 'cancelled'
                    payment_provider: string | null
                    payment_reference: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    customer_email: string
                    customer_phone?: string | null
                    total_amount: number
                    status?: 'pending' | 'paid' | 'failed' | 'cancelled'
                    payment_provider?: string | null
                    payment_reference?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    customer_email?: string
                    customer_phone?: string | null
                    total_amount?: number
                    status?: 'pending' | 'paid' | 'failed' | 'cancelled'
                    payment_provider?: string | null
                    payment_reference?: string | null
                    created_at?: string
                }
            }
        }
    }
}
