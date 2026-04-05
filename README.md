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

Local development is standardized on [http://127.0.0.1:3000](http://127.0.0.1:3000).
Use that exact origin for browser testing and Google OAuth callbacks.

## Production Build

```bash
npm run build
npm run preview
# or run the built server directly
npm run start
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
AUTH_ORIGIN=http://127.0.0.1:3000
NUXT_AUTH_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Notes:

- `AUTH_ORIGIN` must be the site origin only, for example `http://127.0.0.1:3000`.
- Do not include `/api/auth` in `AUTH_ORIGIN`; `baseURL` is configured separately.
- `NUXT_AUTH_SECRET` is required for auth session signing.
- The Google variables are required only when Google OAuth is enabled.
- `npm run dev` binds to `127.0.0.1:3000` by default so local OAuth and manual testing stay aligned.

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
