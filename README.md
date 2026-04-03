# Movie Booking Nuxt App

A clean starter project for a movie ticket booking application built with Nuxt 3, designed to be simple, maintainable, and easy to extend.

## Tech Stack

- Nuxt 3
- TypeScript
- Tailwind CSS
- Pinia
- ESLint
- Prettier

## Goals

- Provide a solid foundation for building a movie booking application
- Include ready-to-use routes for both user flow and admin flow
- Keep the project structure clear and scalable
- Include a base API wrapper, auth middleware stub, minimal state, and core domain types

## Project Structure

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

## Available Routes

- `/`
- `/movies`
- `/movies/[id]`
- `/booking/[showtimeId]`
- `/checkout/[bookingId]`
- `/tickets`
- `/admin/movies`
- `/admin/showtimes`

## Current Features

- Public movie listing page
- Movie detail page with available showtimes
- Seat selection flow for booking
- Checkout summary page backed by Pinia booking state
- Tickets page placeholder for authenticated users
- Admin placeholders for movies and showtimes
- English and Vietnamese language switcher
- Vietnamese as the default locale for first-time visitors
- Persistent locale selection using cookies
- Responsive layout with shared header and footer
- Global loading indicator and custom error page
- Scrollbar-stable layout to reduce route-change layout shift
- Vercel-ready deployment setup with connected Git workflow

## Run the Project

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Quality Checks

```bash
npm run lint
npm run typecheck
```

## Development Workflow

Branching, pull request rules, and release flow are documented in
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Environment Variables

Create a `.env` file from `.env.example` if needed.

```env
NUXT_PUBLIC_API_BASE_URL=https://api.example.com
```

This variable is used in Nuxt runtime config as the base URL for API calls.

## Included Setup

- TypeScript strict mode
- Tailwind CSS with a basic design system
- Pinia stores for `user` and `booking`
- Default layout with header and footer
- Global loading indicator
- Error page
- Empty state component
- Base API service
- Global API error normalization
- Auth route middleware stub
- Mock data so the UI can render immediately

## Important Files

- `nuxt.config.ts`: Nuxt configuration, modules, and runtime config
- `services/api.ts`: fetch wrapper for API requests
- `stores/user.ts`: user state
- `stores/booking.ts`: booking state
- `types/index.ts`: core domain interfaces
- `assets/css/main.css`: global styles and shared utility classes
- `tailwind.config.ts`: theme tokens for colors, spacing, and typography

## Suggested Next Steps

- Connect a real backend for movies, showtimes, and bookings
- Add full authentication and authorization
- Replace mock data with API-driven data
- Add form validation
- Add tests for stores, services, and critical page flows
