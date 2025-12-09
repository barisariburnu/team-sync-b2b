# Team Sync B2B

Umay Backend ve Umay Admin’den oluşan monorepo. Backend, Express + TypeScript ve Drizzle ORM ile REST API sunar; Frontend, React + Vite ile yönetim arayüzü sağlar.

## Özellikler
- JWT tabanlı kimlik doğrulama ve yetkilendirme
- Organizasyon ve kullanıcı uç noktaları (OpenAPI dokümantasyonu ile)
- Güvenlik katmanları: Helmet, CORS, hız sınırlandırma
- Test altyapısı: Vitest + Supertest
- Kod kalitesi: ESLint, Prettier, TypeScript Strict

## Proje Yapısı
- `backend/`: Express + TypeScript API
- `frontend/`: React + Vite admin paneli

## Kurulum
1. Gereksinimler: Node.js 20+, PNPM 9+
2. Ortam değişkenlerini oluşturun:
   - `backend/.env.example` ve `frontend/.env.example` dosyalarını `.env` olarak kopyalayın ve değerleri doldurun.
3. Bağımlılıkları yükleyin:
   - Backend: `cd backend && pnpm install`
   - Frontend: `cd frontend && pnpm install`

## Geliştirme
- Backend başlatma: `cd backend && pnpm dev`
- Frontend başlatma: `cd frontend && pnpm dev`

## Testler
- Backend: `cd backend && pnpm test`
- Frontend: `cd frontend && pnpm test`

## Kullanım
- Backend API varsayılan `http://localhost:5000/api/v1` adresinde çalışır.
- Frontend, `VITE_API_BASE_URL` üzerinden Backend’e bağlanır.

## Katkıda Bulunma
- Fork + branch (örn. `feature/...` veya `bugfix/...`)
- Konvansiyonel commit formatı kullanın
- PR’larda test ve performans etkisini belirtin

## Lisans
MIT — detaylar için `LICENSE.md`.
