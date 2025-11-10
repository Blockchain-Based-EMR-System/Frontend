# GP Frontend

A modern Next.js frontend application with feature-based architecture, TypeScript, and bilingual support (English/Arabic).

## 🏗️ Architecture

This project follows a **feature-based architecture** where each feature is self-contained with its own:

- **API layer** - HTTP client functions
- **Query layer** - React Query hooks
- **Types** - TypeScript definitions
- **Components** - UI components

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (pages)/           # Page routes
│   ├── layout.tsx
│   └── globals.css
│
├── features/              # Feature modules
│   ├── login/            # Login feature
│   │   ├── api/
│   │   ├── query/
│   │   ├── types/
│   │   └── components/
│   ├── register/         # Registration feature
│   ├── password/         # Password reset feature
│   └── google-auth/      # Google OAuth feature
│
├── components/            # Shared components
│   ├── common/           # Common components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (shadcn)
│
├── contexts/             # React contexts
│   ├── LanguageProvider.tsx
│   ├── ThemeProvider.tsx
│   └── QueryProvider.tsx
│
├── hooks/                # Custom hooks
├── lib/                  # Utility libraries
│   ├── apiClient.ts     # Axios instance
│   ├── tokenManager.ts  # Token management
│   └── utils.ts
│
└── locales/              # Internationalization
    ├── en/              # English translations
    └── ar/              # Arabic translations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Authentication Features

### Login

- Email/Username and password authentication
- Remember me functionality
- Automatic token management
- Redirects based on user status

### Registration

- Multi-step registration flow
- Email verification with OTP
- Profile completion
- Phone number validation

### Password Reset

- Forget password flow
- Email-based token reset
- Secure password update

### Google OAuth

- One-click Google sign-in
- Phone number update for Google users

## 🌍 Internationalization

Supports English and Arabic with RTL (Right-to-Left) layout for Arabic.

```typescript
import { useLanguage } from "@/contexts/LanguageProvider";

const { locale, setLocale } = useLanguage();
```

## 🎨 Theming

Light and dark mode support using next-themes.

```typescript
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
```

## 📡 API Integration

All API endpoints are configured to work with the backend Swagger specification.

### Base URL

Set in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Usage Example

```typescript
import { useLogin } from "@/features/login";

function LoginPage() {
  const loginMutation = useLogin();

  const handleLogin = async (data) => {
    await loginMutation.mutateAsync({
      emailOrUsername: data.email,
      password: data.password,
      rememberMe: true,
    });
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

## 🔧 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Internationalization**: next-intl
- **Icons**: Lucide React

## 📚 Documentation

- [`RESTRUCTURING_SUMMARY.md`](./RESTRUCTURING_SUMMARY.md) - Detailed restructuring information
- [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md) - Quick reference guide with examples
- [`MIGRATION_COMPLETE.md`](./MIGRATION_COMPLETE.md) - Migration completion summary

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Code Style

This project uses ESLint and Prettier for code formatting.

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

[Your License Here]

## 🔗 Links

- [Backend API Documentation](./swagger.yaml)
- [Design System](#)
- [Project Board](#)

---

Built with ❤️ by the GP Team
