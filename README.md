# gym-it Digital Products 💪

A Next.js-based e-commerce platform for digital fitness products including workout plans, schedules, and fitness programs. Built with Next.js, Supabase, and integrated with MTN Mobile Money payment gateway.

## Features

- 🏋️ Digital fitness product catalog
- 🛒 Shopping cart functionality
- 💳 MTN Mobile Money payment integration via Paystack
- 👤 User authentication and profiles
- 📱 Fully responsive mobile-first design
- 🔐 Admin dashboard for product management
- 📧 Order management and email notifications
- 🎨 Modern dark-themed UI with premium aesthetics

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Paystack (MTN Mobile Money)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **TypeScript:** For type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Paystack account (for payment integration)

### Installation

1. Clone the repository:
```bash
git clone git@github.com:AncienO/gym_it_digital_product.git
cd gym_it_digital_product
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
gym_it_digital_product/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── ...
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── supabase/             # Database migrations
└── types/                # TypeScript type definitions
```

## Database Setup

Run the Supabase migrations in order:
```bash
# Apply migrations via Supabase CLI or dashboard
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AncienO/gym_it_digital_product)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Contact

For support or inquiries: [gym.it.digital@gmail.com](mailto:gym.it.digital@gmail.com)
