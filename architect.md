# Multi-Tenant Emlak ve Kamulaştırma Yönetim Sistemi - Güncel Mimari

## Testing Coverage Notes

- Added comprehensive tests for `organizations` routes covering list, get by id, create, update, and delete, including invalid id and not-found branches.
- Implemented unit tests for `auth.service` (password verification and JWT signing) to raise function coverage.
- Implemented unit tests for `db/index` that mock `postgres` and `drizzle` to validate connection initialization and caching.
- Added a small enum test for `ErrorCodeEnum` to ensure exported values remain consistent.
- Tests run under `NODE_ENV=test` and set `JWT_SECRET` to ensure authentication middleware verifies tokens.
- Coverage thresholds in `vitest.config.mts` (lines/statements/functions 90%, branches 80%) are met.

## CI/CD Integration Notes

- Root workflow lives at `.github/workflows/ci.yml` and orchestrates two jobs: `backend` and `frontend`.
- Uses Node.js `20` and PNPM `8` with dependency caching via `actions/setup-node` (`cache: pnpm`) and `cache-dependency-path` set per workspace.
- Backend job (working directory `backend`):
  - `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.
  - Security step: `pnpm audit --prod --audit-level=moderate` with `continue-on-error: true` to surface issues without failing builds.
  - Coverage enforced by Vitest thresholds (lines/statements/functions `90%`, branches `80%`). Current coverage exceeds thresholds.
- Frontend job (working directory `frontend`):
  - `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm format:check`, `pnpm build`.
- Stale issue/pr housekeeping has been centralized under `.github/workflows/stale.yml` (migrated from `frontend/.github`).
- Local verification commands:
  - Backend: `pnpm test` and `pnpm exec vitest run --coverage`.
  - Frontend: `pnpm lint`, `pnpm format:check`, `pnpm build`.


Güncellenmiş teknoloji stack'e göre kapsamlı mimariyi oluşturuyorum.

## 1. Güncel Teknoloji Stack

### Backend

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: jsonwebtoken + bcrypt
- **Logging**: Winston + Morgan
- **API Documentation**: OpenAPI

### Frontend

- **Framework**: React 18 + Vite
- **UI Library**: Shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: TanStack Query (React Query)
- **Routing**: TanStack Router
- **Icons**: Lucide React

### Database

- **RDBMS**: PostgreSQL 16+
- **Migration**: Drizzle Kit
- **Backup**: pg_dump scheduled jobs

### DevOps

- **Containerization**: Docker + Docker Compose
- **Version Control**: Git

---

## 2. Proje Klasör Yapısı

```
emlak-kamulaştırma-sistem/
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   │   ├── users.schema.js
│   │   │   │   ├── organization.schema.js
│   │   │   │   ├── applications.schema.js
│   │   │   │   ├── roles.schema.js
│   │   │   │   ├── permissions.schema.js
│   │   │   │   ├── projects.schema.js
│   │   │   │   ├── projectAreas.schema.js
│   │   │   │   ├── owners.schema.js
│   │   │   │   ├── auditLogs.schema.js
│   │   │   │   └── index.js
│   │   │   ├── migrations/
│   │   │   └── index.js
│   │   │
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   ├── logger.js
│   │   │   └── env.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── permission.middleware.js
│   │   │   ├── audit.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   ├── errorHandler.middleware.js
│   │   │   └── requestLogger.middleware.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── users.controller.js
│   │   │   ├── applications.controller.js
│   │   │   ├── projects.controller.js
│   │   │   ├── projectAreas.controller.js
│   │   │   ├── owners.controller.js
│   │   │   └── organization.controller.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── users.service.js
│   │   │   ├── permissions.service.js
│   │   │   ├── projects.service.js
│   │   │   ├── projectAreas.service.js
│   │   │   ├── owners.service.js
│   │   │   ├── audit.service.js
│   │   │   └── organization.service.js
│   │   │
│   │   ├── routes/
│   │   │   ├── v1/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── users.routes.js
│   │   │   │   ├── applications.routes.js
│   │   │   │   ├── projects.routes.js
│   │   │   │   ├── projectAreas.routes.js
│   │   │   │   ├── owners.routes.js
│   │   │   │   ├── organization.routes.js
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── users.validator.js
│   │   │   ├── projects.validator.js
│   │   │   ├── projectAreas.validator.js
│   │   │   └── owners.validator.js
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── response.js
│   │   │   ├── errors.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── constants/
│   │   │   ├── permissions.js
│   │   │   ├── roles.js
│   │   │   └── statuses.js
│   │   │
│   │   └── app.js
│   │
│   ├── drizzle.config.js
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              (Shadcn components)
│   │   │   │   ├── button.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── ApplicationSwitcher.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── PermissionGuard.jsx
│   │   │   │
│   │   │   ├── applications/
│   │   │   │   ├── ApplicationCard.jsx
│   │   │   │   ├── ApplicationForm.jsx
│   │   │   │   └── RolePermissionManager.jsx
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   ├── ProjectList.jsx
│   │   │   │   ├── ProjectForm.jsx
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   └── ProjectStats.jsx
│   │   │   │
│   │   │   ├── project-areas/
│   │   │   │   ├── AreaList.jsx
│   │   │   │   ├── AreaForm.jsx
│   │   │   │   └── AreaOwners.jsx
│   │   │   │
│   │   │   ├── owners/
│   │   │   │   ├── OwnerList.jsx
│   │   │   │   ├── OwnerForm.jsx
│   │   │   │   ├── OwnerDetail.jsx
│   │   │   │   └── OwnerShares.jsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── DataTable.jsx
│   │   │       ├── SearchBar.jsx
│   │   │       ├── Pagination.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── __root.jsx
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── applications/
│   │   │   │   ├── index.jsx
│   │   │   │   └── $appId.jsx
│   │   │   ├── projects/
│   │   │   │   ├── index.jsx
│   │   │   │   └── $projectId/
│   │   │   │       ├── index.jsx
│   │   │   │       └── areas.jsx
│   │   │   ├── owners/
│   │   │   │   ├── index.jsx
│   │   │   │   └── $ownerId.jsx
│   │   │   └── organization.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePermissions.js
│   │   │   ├── useApplications.js
│   │   │   ├── useProjects.js
│   │   │   └── useOwners.js
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   ├── queryClient.js
│   │   │   └── utils.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── applications.service.js
│   │   │   ├── projects.service.js
│   │   │   ├── owners.service.js
│   │   │   └── organization.service.js
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── appStore.js
│   │   │   └── uiStore.js
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── components.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 2.1 Dosya İsimlendirme ve Klasörleme Konvansiyonu

- İsimlendirme: Tüm dosyalar kebab-case kullanır (ör. `request-logger.middleware.ts`).
- Sonekler: Türler için standart sonekler kullanılır.
  - `*.controller.ts`, `*.routes.ts`, `*.middleware.ts`, `*.config.ts`, `*.enum.ts`, `*.validation.ts`, `*.service.ts`, `*.util.ts`
- Versiyonlama: Route seviyesinde klasör ile yapılır (ör. `routes/v1`). Controller dosya adına `v1/v2` eklenmez.
- Modüler yapı: Domain odaklı modüller altında organize edilir.

```
backend/src/
├── modules/
│   ├── auth/
│   │   └── controllers/
│   │       └── auth.controller.ts
│   └── users/
│       └── controllers/
│           └── users.controller.ts
├── routes/
│   └── v1/
│       ├── auth.routes.ts
│       ├── users.routes.ts
│       └── index.ts
├── middlewares/
│   ├── async-handler.middleware.ts
│   ├── error-handler.middleware.ts
│   └── request-logger.middleware.ts
├── utils/
│   └── app-error.ts
└── config/
    ├── app.config.ts
    ├── http.config.ts
    └── openapi.config.ts
```

Rehber:
- Yeni bir domain eklerken `modules/<domain>` altında ilgili `controllers`, `validation`, `services` alt klasörleri açın.
- Route dosyaları `routes/vX` altında versiyonlanır ve modül controller’larını içe aktarır.
- Ortak middleware ve util dosyaları `middlewares` ve `utils` altında kebab-case ile tutulur.

---

## 3. Veritabanı Şeması (Drizzle ORM)Şimdi de Backend konfigürasyon dosyalarını hazırlayalım:Şimdi Backend middleware'lerini oluşturalım:Şimdi kritik servis dosyalarını oluşturalım:Şimdi Ana uygulama dosyasını ve örnek route yapısını oluşturalım:Şimdi Frontend yapısını oluşturalım. Önce TanStack Router ve temel yapılandırmaları:Şimdi Frontend servislerini ve hook'ları oluşturalım:Son olarak Docker yapılandırmasını ve proje başlangıç dokümanını hazırlayalım:Mükemmel! Şimdi projenin mimari özetini ve önemli noktaları içeren son bir döküman hazırlayayım:

## 🎯 Proje Mimarisi Özeti

Kapsamlı bir **Multi-Tenant Emlak ve Kamulaştırma Yönetim Sistemi** mimarisi oluşturdum. İşte öne çıkan özellikler:

### ✅ Tamamlanan Yapı

1. **Veritabanı Şeması** (Drizzle ORM)

   - 11 ana tablo
   - Çok katmanlı yetkilendirme yapısı
   - Esnek metadata desteği
   - Kapsamlı audit logging

2. **Backend Mimarisi** (Node.js + Express)

   - Drizzle ORM ile PostgreSQL entegrasyonu
   - JWT token bazlı authentication
   - Çok katmanlı permission sistemi
   - Audit middleware ile otomatik loglama
   - Zod ile validation
   - Winston logger
   - Rate limiting

3. **Frontend Mimarisi** (React + Vite)

   - TanStack Router ile routing
   - TanStack Query ile data fetching
   - Zustand ile state management
   - Shadcn/ui component library
   - Permission based component rendering

4. **DevOps**
   - Docker Compose yapılandırması
   - Development environment hazır

### 🔑 Ana Özellikler

**Çok Uygulamalı Yapı:**

- Tek platformda birden fazla uygulama (Emlak, Kamulaştırma, vb.)
- Merkezi kullanıcı yönetimi
- Uygulama bazlı izole edilmiş veriler

**Gelişmiş Yetkilendirme:**

- Sistem Admin → Tüm uygulamaları yönetir
- Uygulama Admin → Bir uygulamayı yönetir
- Rol bazlı yetkiler → Her uygulamada farklı roller
- User override → Kullanıcı özel yetkileri

**Proje Yönetimi:**

- Projeler → Uygulamaya bağlı
- Proje Alanları → Ada/Parsel yönetimi
- Malikler → Gerçek/Tüzel kişi desteği
- Hisse Yönetimi → Pay/Payda takibi

**Güvenlik:**

- JWT + Refresh Token
- Çok katmanlı authorization
- Kapsamlı audit logging (her işlem loglanır)
- Rate limiting

### 📊 Veritabanı İlişkileri

```
Organization (1) ← Kurum bilgileri

Users (N) ← Merkezi kullanıcı yönetimi
  ↓
UserApplicationRoles (N:M) → Applications (N)
  ↓                              ↓
Roles (N) → Permissions (N)    Projects (N)
                                ↓
                            ProjectAreas (N)
                                ↓
                            ProjectAreaOwners (N:M) → Owners (N)
```

### 🚦 Başlangıç Adımları

1. **Environment Kurulumu:**

   ```bash
   docker-compose up -d
   ```

2. **İlk Admin Kullanıcı Oluşturma:**

   - Database'e manuel olarak `is_system_admin=true` olan bir user ekleyin

3. **İlk Uygulama Oluşturma:**

   - Sistem admin ile giriş yapın
   - "Emlak Yönetimi" uygulamasını oluşturun
   - Roller ve yetkileri tanımlayın

4. **Kullanıcılara Rol Atama:**
   - Kullanıcıları uygulamalara atayın
   - Rolleri belirleyin

### 📁 Artifact'lerde Hazır Dosyalar

1. **drizzle_schema** - Tam veritabanı şeması
2. **backend_config** - Backend konfigürasyonları
3. **backend_middlewares** - Auth, Permission, Audit middleware'leri
4. **backend_services** - Auth, Permission, Audit servisleri
5. **backend_app_routes** - Ana uygulama ve route örnekleri
6. **frontend_config** - Frontend konfigürasyonları
7. **frontend_services_hooks** - API servisleri ve custom hooks
8. **docker_readme** - Docker ve README dokümantasyonu

### 🎨 Öne Çıkan Tasarım Kararları

1. **Ada/Parsel Çoklu Proje Desteği:** Aynı ada/parsel farklı projelerde kullanılabilir ama her proje kendi verilerini izole tutar

2. **Malik Hisse Yapısı:** Tek hisse oranı, değişirse yeni kayıt oluşturulabilir (tarihçe için)

3. **Metadata Alanları:** Her seviyede JSONB metadata alanları sayesinde uygulama özel veriler eklenebilir

4. **Audit Logging:** Middleware ile otomatik, her kritik işlem loglanır

5. **Permission Override:** Kullanıcıya özel yetkiler rol yetkilerini override edebilir
