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
                    price_usd: number | null
                    duration: string | null
                    duration_weeks: number | null
                    image_url: string | null
                    preview_url: string | null
                    file_url: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    price_usd?: number | null
                    duration?: string | null
                    duration_weeks?: number | null
                    image_url?: string | null
                    preview_url?: string | null
                    file_url: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    price_usd?: number | null
                    duration?: string | null
                    duration_weeks?: number | null
                    image_url?: string | null
                    preview_url?: string | null
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
                    currency: string
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
                    currency?: string
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
                    currency?: string
                    status?: 'pending' | 'paid' | 'failed' | 'cancelled'
                    payment_provider?: string | null
                    payment_reference?: string | null
                    created_at?: string
                }
            }
            collections: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    slug: string
                    image_url: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    slug: string
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    slug?: string
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            product_collections: {
                Row: {
                    collection_id: string
                    product_id: string
                    created_at: string
                }
                Insert: {
                    collection_id: string
                    product_id: string
                    created_at?: string
                }
                Update: {
                    collection_id?: string
                    product_id?: string
                    created_at?: string
                }
            }
        }
    }
}
