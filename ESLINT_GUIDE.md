# ESLint va Prettier Sozlamalari

## Avtomatik tekshiruv

### VS Code da

Fayl saqlaganda avtomatik:

- ✅ Kod formatlash (Prettier)
- ✅ ESLint xatolarini tuzatish
- ✅ Import tartibini sozlash

### Terminal orqali

```bash
# Barcha fayllarni tekshirish
npm run lint

# Avtomatik tuzatish
npm run lint:fix

# Kod formatlash
npm run format
```

## Asosiy qoidalar

### ❌ Qat'iyan taqiqlangan

- `var` o'rniga faqat `const` yoki `let`
- `==` o'rniga faqat `===`
- `console.log()` - production kodda
- `debugger` va `alert()`
- `any` tipi (iloji boricha)
- Arrow function bo'lmagan funksiyalar
- Default export

### ✅ Majburiy

- Har bir fayl nomi `kebab-case` (masalan: `user-controller.ts`)
- Importlar tartibli va guruhlangan
- Type import alohida: `import type { User } from './types'`

### 📝 Nomlash standartlari

- Variables: `camelCase` yoki `UPPER_CASE`
- Functions: `camelCase`
- Classes: `PascalCase`
- Interfaces: `PascalCase`
- Enums: `PascalCase`
- Enum members: `UPPER_CASE`
- Parameters: `camelCase` (snake_case ham qabul qilinadi)

### ⚠️ Ogohlantirishlar

- `any` ishlatish
- Magic raqamlar (0, 1, -1 dan tashqari)
- Nullish coalescing (`??`) o'rniga `||`
- Optional chaining (`?.`) ishlatmaslik

## Misol

```typescript
// ❌ Noto'g'ri
var userName = 'John'
if (user == null) console.log('Error')
export default function getUserData() {
   return any
}

// ✅ To'g'ri
const userName = 'John'
if (user === null) {
   throw new Error('User not found')
}
export const getUserData = (): User => {
   return userData
}
```
