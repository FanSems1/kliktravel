# Panduan Pengaturan Typography & Spacing (Design System Guide) - Klik Travel ID

Panduan ini dibuat untuk memudahkan Anda melakukan penyesuaian (*adjustment*) pada ukuran font, line-height, dan jarak antar elemen pada seluruh halaman website **Klik Travel ID**.

Seluruh sistem typography dan spacing telah distandardisasi secara terpusat menggunakan **Tailwind CSS Utility Classes** pada file global CSS:
`src/app/globals.css`

---

## 1. Daftar Utility Class Typography Standard

Berikut adalah utility class yang digunakan di seluruh komponen website:

| Utility Class | Fungsi / Kegunaan | Ukuran Desktop | Ukuran Mobile |
| :--- | :--- | :--- | :--- |
| `typography-hero` | Judul utama paling besar (Hero Section di Homepage, Private Trip, dll.) | `text-4xl md:text-6xl lg:text-7xl` (serif, normal) | `text-3xl / text-4xl` |
| `typography-section` | Judul section di setiap section halaman (misal: "Destinasi Pilihan", "Jelajahi Dunia") | `text-2xl md:text-4xl` (serif, normal) | `text-2xl` |
| `typography-subheading` | Subheading / Subtitle di bawah judul section | `text-sm md:text-base` (sans, normal/medium) | `text-sm` |
| `typography-card` | Judul card produk / paket / fitur | `text-lg md:text-xl` (serif/sans, font-normal / font-bold) | `text-base` |
| `typography-package-title` | Judul nama paket tour pada halaman detail | `text-2xl md:text-3xl` (sans, font-bold) | `text-xl` |
| `typography-body` | Teks paragraf / deskripsi | `text-sm md:text-base` (sans, leading-relaxed, text-slate-600) | `text-[#0F2C59]/75` |
| `typography-caption` | Tag kecil / badge di atas judul section (misal: "JELAJAHI DESTINASI") | `text-xs md:text-sm` (mono, font-bold, uppercase, text-[#A89053]) | `text-xs` |
| `typography-[#A89053]` | Tag/Accent warna emas | Warna `hsl(43 34% 49%)` / `#A89053` | - |
| `typography-button` | Teks pada tombol CTA | `text-xs md:text-sm` (sans, font-bold, uppercase, tracking-wider) | `text-xs` |
| `typography-price` | Teks nominal harga produk | `text-lg md:text-2xl` (sans, font-extrabold, text-[#0284C7]) | `text-lg` |
| `typography-section-spacing` | Spacing / Padding atas & bawah setiap section | `py-16 md:py-24` | `py-12` |

---

## 2. Cara Mengubah Ukuran Typography Secara Global

Jika Anda ingin memperbesar atau memperkecil ukuran font pada **seluruh website sekaligus** (misal memperbesar judul section di desktop dari `3xl` ke `4xl`):

1. Buka file `src/app/globals.css`.
2. Cari bagian `@utility typography-*`.
3. Ubah nilai Tailwind font-size atau spacing-nya. Contoh:

```css
/* Mengubah judul section agar sedikit lebih besar di mobile & desktop */
@utility typography-section {
  @apply font-serif text-3xl md:text-5xl text-[#0F2C59] font-normal leading-tight tracking-tight;
}
```

Setelah Anda menyimpannya, seluruh judul section pada semua halaman website akan otomatis menyesuaikan!

---

## 3. Cara Mengatur Jarak antar Section (Section Spacing)

Semua section utama telah dibungkus dengan kelas `typography-section-spacing`. 
Jika Anda merasa jarak antar-section terlalu jauh atau terlalu dekat:

1. Buka `src/app/globals.css`.
2. Cari `@utility typography-section-spacing`.
3. Ubah padding vertikalnya (`py-*`):

```css
@utility typography-section-spacing {
  /* Ubah py-16 md:py-24 menjadi py-12 md:py-20 jika ingin jarak lebih rapat */
  @apply py-12 md:py-20;
}
```

---

## 4. Cara Mengubah Konten Teks & Bahasa (ID / EN)

Untuk mengubah teks atau kalimat pada website (misal di homepage atau header), semua data terjemahan berada di:
`src/data/translations.ts`

Contoh struktur di `translations.ts`:
```ts
export const translations = {
  id: {
    hero_title: "Jelajahi Dunia, Ciptakan Cerita",
    hero_subtitle: "Liburan Impianmu Dimulai Disini...",
    // ...
  },
  en: {
    hero_title: "Explore the World, Create Stories",
    hero_subtitle: "Your Dream Vacation Starts Here...",
    // ...
  }
};
```
Anda tinggal mengedit teks di dalam file `src/data/translations.ts` untuk memperbarui konten Bahasa Indonesia maupun Bahasa Inggris secara bersamaan.
