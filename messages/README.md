# 🌐 Translations Structure

This directory contains all internationalization (i18n) messages for the EMR Blockchain System.

## 📁 Structure

```
messages/
├── en/                      # English translations
│   ├── common.json         # Common UI elements (buttons, labels, etc.)
│   ├── auth.json           # Authentication & authorization
│   ├── dashboard.json      # Dashboard-specific text
│   ├── patients.json       # Patient management
│   ├── records.json        # Medical records
│   └── settings.json       # Settings page
└── ar/                      # Arabic translations
    ├── common.json         # نصوص واجهة المستخدم المشتركة
    ├── auth.json           # المصادقة والتفويض
    ├── dashboard.json      # نصوص لوحة التحكم
    ├── patients.json       # إدارة المرضى
    ├── records.json        # السجلات الطبية
    └── settings.json       # صفحة الإعدادات
```

## 🎯 File Organization

Each file is organized by feature/domain:

- **common.json** - Shared across all pages (navigation, buttons, general actions)
- **auth.json** - Login, registration, password reset, validation messages
- **dashboard.json** - Dashboard overview, statistics, quick actions
- **patients.json** - Patient management, forms, patient details
- **records.json** - Medical records, blockchain verification, record types
- **settings.json** - User preferences, profile, notifications, theme

## 📝 Usage Examples

### Basic Usage (All translations available)

\`\`\`tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
const t = useTranslations();

return (
<div>
<h1>{t('welcome')}</h1>
<button>{t('save')}</button>
<p>{t('description')}</p>
</div>
);
}
\`\`\`

### Accessing Specific Keys

\`\`\`tsx
'use client';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
const t = useTranslations();

return (
<form>
<h1>{t('login')}</h1>
<input placeholder={t('email')} />
<input placeholder={t('password')} />
<button>{t('signIn')}</button>
<a href="/forgot">{t('forgotPassword')}</a>
</form>
);
}
\`\`\`

### Using in Server Components

\`\`\`tsx
import { useTranslations } from 'next-intl';

export default function ServerComponent() {
const t = useTranslations();
return <h1>{t('welcome')}</h1>;
}
\`\`\`

## ➕ Adding New Translations

### 1. Add to English file

\`\`\`json
// messages/en/patients.json
{
"newField": "New Field Label"
}
\`\`\`

### 2. Add corresponding Arabic translation

\`\`\`json
// messages/ar/patients.json
{
"newField": "تسمية الحقل الجديد"
}
\`\`\`

### 3. Use in component

\`\`\`tsx
const t = useTranslations();
<label>{t('newField')}</label>
\`\`\`

## 📦 Adding New Translation Files

If you need a new feature domain:

### 1. Create new files

\`\`\`bash
messages/en/appointments.json
messages/ar/appointments.json
\`\`\`

### 2. Update i18n.ts

\`\`\`typescript
// i18n.ts
return {
locale,
messages: {
...(await import(\`./messages/\${locale}/common.json\`)).default,
...(await import(\`./messages/\${locale}/auth.json\`)).default,
...(await import(\`./messages/\${locale}/appointments.json\`)).default, // Add this
// ... other imports
},
};
\`\`\`

### 3. Use in components

\`\`\`tsx
const t = useTranslations();

<h1>{t('appointmentTitle')}</h1>
\`\`\`

## 🔄 Translation Workflow

1. **Add English first** - Always start with English translations
2. **Add Arabic translation** - Ensure every English key has an Arabic counterpart
3. **Keep keys consistent** - Use the same key names in both files
4. **Test both languages** - Switch language in UI and verify text displays correctly
5. **Check RTL layout** - Ensure Arabic text displays properly with RTL layout

## ✅ Best Practices

### Key Naming

- ✅ Use camelCase: `patientName`, `addNewRecord`
- ✅ Be descriptive: `emailRequired` not `err1`
- ✅ Group related keys: `login`, `loginSuccess`, `loginError`
- ❌ Avoid abbreviations: `email` not `em`

### Organization

- ✅ Keep files under 50 keys for readability
- ✅ Create new files for major features
- ✅ Reuse common translations from `common.json`
- ❌ Don't duplicate keys across files

### Arabic Translations

- ✅ Use proper Arabic grammar and diacritics when needed
- ✅ Keep formal tone for medical context
- ✅ Test with RTL layout enabled
- ✅ Consider length differences (Arabic can be longer/shorter)

## 🧪 Testing Translations

### Check for missing keys

\`\`\`bash

# Compare en and ar files to ensure all keys exist

npm run lint:translations # (if you set up a script)
\`\`\`

### Test in browser

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Toggle between EN/AR using language switcher
4. Navigate all pages and verify text

## 🛠️ Translation Tools

### VS Code Extensions

- **i18n Ally** - Inline translation management
- **Better Comments** - Annotate translation TODOs

### Useful Scripts

\`\`\`json
// package.json
{
"scripts": {
"translations:check": "node scripts/check-translations.js"
}
}
\`\`\`

## 📊 Current Translation Coverage

| File           | Keys | Status      |
| -------------- | ---- | ----------- |
| common.json    | 18   | ✅ Complete |
| auth.json      | 22   | ✅ Complete |
| dashboard.json | 8    | ✅ Complete |
| patients.json  | 17   | ✅ Complete |
| records.json   | 23   | ✅ Complete |
| settings.json  | 22   | ✅ Complete |

**Total:** ~110 translation keys

## 🔮 Future Additions

Consider adding these files as features grow:

- `appointments.json` - Appointment scheduling
- `billing.json` - Billing and payments
- `reports.json` - Reports and analytics
- `notifications.json` - In-app notifications
- `errors.json` - Error messages and codes
- `validation.json` - Form validation messages

---

Need help? Check the [main setup guide](../SETUP_GUIDE.md) or ask the team!
