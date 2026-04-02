# Movie Booking Nuxt App

Starter project cho hệ thống đặt vé xem phim, được xây dựng với Nuxt 3 theo hướng đơn giản, rõ ràng và dễ mở rộng.

## Tech Stack

- Nuxt 3
- TypeScript
- Tailwind CSS
- Pinia
- ESLint
- Prettier

## Mục tiêu

- Cung cấp nền tảng sạch để phát triển ứng dụng booking phim
- Có sẵn routing cơ bản cho user flow và admin flow
- Có sẵn cấu trúc thư mục rõ ràng để mở rộng theo module
- Có API wrapper, middleware auth stub, state tối thiểu và type cơ bản

## Cấu trúc thư mục

```text
.
|-- assets/
|-- components/
|-- composables/
|-- constants/
|-- layouts/
|-- middleware/
|-- pages/
|-- services/
|-- stores/
|-- types/
|-- utils/
|-- app.vue
|-- error.vue
|-- nuxt.config.ts
|-- tailwind.config.ts
```

## Các route đã có

- `/`
- `/movies`
- `/movies/[id]`
- `/booking/[showtimeId]`
- `/checkout/[bookingId]`
- `/tickets`
- `/admin/movies`
- `/admin/showtimes`

## Chạy dự án

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Kiểm tra chất lượng

```bash
npm run lint
npm run typecheck
```

## Environment Variables

Tạo file `.env` từ `.env.example` nếu cần.

```env
NUXT_PUBLIC_API_BASE_URL=https://api.example.com
```

Biến này được dùng trong runtime config để làm base URL cho API calls.

## Những gì đã được setup

- TypeScript strict mode
- Tailwind CSS với design system cơ bản
- Pinia store cho `user` và `booking`
- Default layout với header và footer
- Global loading indicator
- Error page
- Empty state component
- Base API service
- Global API error normalization
- Route middleware auth dạng stub
- Mock data để hiển thị giao diện ngay từ đầu

## File quan trọng

- `nuxt.config.ts`: cấu hình Nuxt, module, runtime config
- `services/api.ts`: fetch wrapper cho API
- `stores/user.ts`: state người dùng
- `stores/booking.ts`: state booking
- `types/index.ts`: các interface chính của domain
- `assets/css/main.css`: style global và utility class
- `tailwind.config.ts`: theme màu sắc, spacing, typography

## Gợi ý bước tiếp theo

- Kết nối backend thật cho movies, showtimes, bookings
- Thêm authentication và authorization đầy đủ
- Thay mock data bằng API data
- Bổ sung form validation
- Thêm test cho store, service và page flow quan trọng
