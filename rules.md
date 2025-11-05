# Proje Kuralları ve En İyi Uygulamalar

Bu belge, Team Sync B2B projesinde frontend (React + TanStack ekosistemi) ve genel UI/UX performansına yönelik rehber niteliğindeki kuralları içerir. Amaç, kod tutarlılığını ve performansı yüksek tutarken geliştirici deneyimini iyileştirmektir.

## TanStack Virtual (Liste/Satır Sanallaştırma)

- `react-virtual` yerine `@tanstack/react-virtual` kullanılmalıdır.
- Sanallaştırılan liste mutlaka bir kaydırma kapsayıcısına (`overflow-auto`) sarılmalıdır; `getScrollElement` ile bu kapsayıcı referansı verilmelidir.
- `estimateSize` değeri tutarlı bir satır yüksekliğini ifade etmelidir. Değişken satır yüksekliğinde ya ölçüm (ResizeObserver) eklenmeli veya güvenli bir ortalama tercih edilmelidir.
- `overscan` 6–12 aralığında tutulmalıdır; büyük listelerde 8 iyi bir varsayılandır.
- `getItemKey` ile stabil bir anahtar sağlanmalıdır (örnek: `rows[index].id`).
- Üstte/ altta boşluk için `paddingTop` ve `paddingBottom` placeholder satırları eklenmelidir; layout kayması önlenir.
- Sanal liste kapsayıcısı için erişilebilirlik semantiği korunmalı, tablo yapılarında `Table`, `TableBody`, `TableRow`, `TableCell` hiyerarşisi bozulmamalıdır.
- Büyük veri hacminde sayfalama yine aktif tutulmalı; sanallaştırma sadece görünür aralık için DOM yükünü azaltır.

## TanStack Table

- Tablo durumları (`sorting`, `rowSelection`, `pagination`, `columnFilters`, `globalFilter`) tek kaynaklı olarak yönetilmelidir. URL senkronizasyonu gerekiyorsa `useTableUrlState` kullanılmalıdır.
- `meta.className`/`meta.thClassName`/`meta.tdClassName` üzerinden hücre ve başlık stilleri verilmeli, bileşen düzeyinde `cn` ile birleştirilmelidir.
- Filtre ve global arama için `globalFilterFn` sade ve hızlı olmalı; ağır hesaplamalar memoize edilmelidir.

## TanStack Query

- Sorgu anahtarları (`queryKey`) hiyerarşik ve anlamlı olmalıdır: `['users', 'list', params]`, `['tasks', 'detail', taskId]`.
- Varsayılan `staleTime` en az 30–60 saniye; sunucu yoğunluğuna göre ayarlanmalıdır. Aşırı `refetchOnWindowFocus` kaçınılmalıdır.
- Mutasyonlarda `onSuccess` ile ilgili sorguları `invalidateQueries` yerine mümkünse `setQueryData` ile doğrudan güncellemek tercih edilmelidir.
- Hata durumlarında kullanıcıya net geri bildirim sağlanmalı; `toast` veya diyaloğa yönlendirme yapılmalıdır.

## TanStack Router

- Route path sabitleri/ yardımcıları merkezi bir modülde tutulmalıdır.
- Arama parametreleri (`search`) için tip güvenli şema (Zod) kullanılmalı; `useTableUrlState` gibi yardımcılar ile tutarlı hale getirilmelidir.
- Prefetch (link hover/visible) gerektiğinde Query ile entegre edilmelidir.

## Zod + react-hook-form

- Formlar `useZodForm` kancası ile oluşturulmalı; `zodResolver` v3/v4 farkları güvenli `any` cast ile köprülenmiştir.
- Şema daraltmaları (`pick`, `omit`) sonrası `onSubmit` parametresi tipleri şema alanlarıyla hizalanmalıdır.
- Varsayılan değerler eksik alan hatalarını önlemek için form başlatılırken sağlanmalıdır.

## Performans ve Render Hijyeni

- Liste/render ağır bileşenlerde `memo` ve `useMemo/useCallback` kullanılmalıdır.
- Uzun listelerde sanallaştırma + sayfalama birlikte kullanılmalı; tek başına sanallaştırma veri aktarımlarını azaltmaz.
- Görsel öğelerde lazy-loading ve `loading="lazy"` tercih edilir.

## Stil ve Bileşen Kuralları

- UI bileşenleri (Table, Dialog, Sheet, Tabs, vb.) shadcn-ui standartlarına uygun kullanılmalıdır.
- Sınıf birleştirme için `cn` yardımcı fonksiyonu kullanılmalı; gereksiz inline stillerden kaçınılmalıdır.
- Tablolarda satır yüksekliği ~44px olarak hedeflenmiştir; `estimateSize` buna göre ayarlanmalıdır.

## Dosya ve İçe Aktarım

- Yol alias’ları `@/` ve `@shared/` ile kullanılmalı; göreli uzun path’lerden kaçınılmalıdır.
- Modül sorumluluğu net olmalı: tablo sütun tanımları `*-columns.tsx`, toolbar/pagination ayrı dosyalarda yer almalıdır.

## Test ve Tip Kontrolü

- Tip kontrol (`pnpm exec tsc -b`) ve lint (`pnpm lint`) temiz olmalıdır.
- UI değişikliklerinde geliştirme sunucusunda görsel doğrulama yapılmalı; kritik akışlarda e2e testler (Playwright) planlanmalıdır.

---

Bu kurallar, projenin ölçeklenebilir ve bakım dostu kalması için rehber niteliğindedir. Gerektikçe güncellenecektir.