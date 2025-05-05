# SupplementScribe

SupplementScribe is an AI-powered web application that creates personalized supplement plans based on users' health profiles, genetic data, and blood work results.

## Features

- **Personalized Analysis**: Upload health data including basic metrics, genetic information, and blood work results
- **AI-Powered Recommendations**: Get supplement recommendations tailored to your specific health needs
- **Scientific Backing**: All recommendations are backed by PubMed studies and scientific research
- **Budget Optimization**: Specify your budget to receive high-quality supplements within your price range
- **AI Chatbot Expert**: Ask questions about your supplement plan and receive personalized answers
- **Purchase Links**: Direct links to purchase recommended supplements

## Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Supabase
- **Authentication**: Will be implemented later in development
- **UI Design**: Apple-inspired clean and minimalist interface

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v7.x or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/supplement-scribe.git
cd supplement-scribe
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
supplement-scribe/
├── src/
│   ├── app/
│   │   ├── chat/
│   │   ├── get-started/
│   │   ├── results/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   └── lib/
│       └── supabase.ts
├── public/
├── .env.local
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Development Roadmap

1. **Phase 1**: Core UI and basic functionality
   - Landing page
   - Health profile input forms
   - Results page with mock data

2. **Phase 2**: AI integration
   - Connect to AI backend for personalized recommendations
   - PubMed study integration
   - Supplement recommendation algorithm

3. **Phase 3**: User authentication
   - User accounts
   - Save and retrieve health profiles
   - Track supplement history

4. **Phase 4**: E-commerce functionality
   - Affiliate links
   - Price comparison
   - Budget optimization

## Authentication

The application uses Supabase for authentication and user management. The following authentication methods are supported:

- Email/password authentication
- Google OAuth

### Setting Up Authentication

1. Make sure your `.env.local` file contains your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Configure Google OAuth in the Supabase dashboard:
   - Go to your Supabase project dashboard
   - Navigate to Authentication → Providers
   - Enable Google provider
   - Create OAuth credentials in Google Cloud Console
   - Add authorized redirect URI: `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`

3. The database schema for users and profiles is defined in `supabase-schema.sql`. You can run this in the Supabase SQL editor to set up the necessary tables and security policies.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for personalized, science-based supplement recommendations
- Designed with a focus on user experience and accessibility 