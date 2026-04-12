# MovieHub User Guide

MovieHub is a Nuxt 3 movie ticket booking web application for customers and admins. Customers can browse movies, review showtimes, select seats, confirm bookings, and check ticket history, while admins can manage movies and schedule showtimes.

## Access the App

Local URL:

- [http://127.0.0.1:3000](http://127.0.0.1:3000)

Main areas:

- `/movies`: browse movies
- `/movies/[id]`: movie detail and showtimes
- `/booking/[showtimeId]`: seat selection
- `/checkout/[bookingId]`: booking confirmation
- `/tickets`: booking history
- `/admin/movies`: admin movie management
- `/admin/showtimes`: admin showtime management

## Demo Accounts

Normal user:

- Email: `user@moviehub.test`
- Password: `Password123!`

Admin user:

- Email: `admin@moviehub.test`
- Password: `Admin123!`

You can also create a new normal user from the Register page.

## Change Language

Use the language switcher in the header:

- `EN`: English
- `VI`: Vietnamese

The selected language is remembered for later visits.

## Customer Flow

### 1. Browse Movies

Go to:

- [http://127.0.0.1:3000/movies](http://127.0.0.1:3000/movies)

What you can do:

- view all currently available movies
- read title, genre, duration, and brief description
- open a movie detail page

If no movies are available, the page shows an empty state instead of a blank screen.

### 2. View Movie Details

Open a movie from the movie list.

What you can do:

- read movie metadata
- review grouped showtimes by date
- identify valid showtimes
- see unavailable or invalid showtimes as disabled

If a movie has no valid showtimes, the showtime section will explain that clearly.

### 3. Select a Showtime

On the movie detail page:

- choose an available showtime
- click the showtime action to continue

The app uses the showtime id as the booking route input and moves you to:

- `/booking/[showtimeId]`

If you are not signed in, protected routes redirect you to Login first.

### 4. Select Seats

On the booking page:

- available seats can be selected
- selected seats can be unselected
- booked or unavailable seats cannot be selected

Seat meanings:

- available: selectable
- selected: currently chosen for your booking
- booked: already unavailable

Rules:

- you can select up to 6 seats
- seat summary updates after every change
- invalid seat layouts are handled safely

### 5. Continue to Checkout

After selecting seats:

- click `Continue to checkout`

The checkout page shows:

- movie title
- room
- showtime
- selected seats
- seat count
- seat price
- subtotal
- total

### 6. Confirm Booking

On checkout:

- review the booking details
- click `Confirm booking`

Protection included:

- duplicate submits are blocked
- invalid or stale booking data is rejected
- the button enters a loading state while confirming

### 7. View Tickets

Go to:

- [http://127.0.0.1:3000/tickets](http://127.0.0.1:3000/tickets)

What you can see:

- booking history
- booking status
- booking id
- QR placeholder area for future ticket scanning

If you have no bookings yet, the page shows a guided empty state with a CTA back to movies.

## Authentication

### Login

Go to:

- [http://127.0.0.1:3000/login](http://127.0.0.1:3000/login)

Supported methods:

- email and password
- Google OAuth

Behavior:

- form validation runs before submit
- invalid email or missing password shows clear error text
- signed-in users are redirected away from guest pages

### Register

Go to:

- [http://127.0.0.1:3000/register](http://127.0.0.1:3000/register)

Rules:

- name is required
- email must be valid
- password must be at least 8 characters
- password must include at least one letter and one number
- password cannot be only spaces

Successful registration creates a normal user account.

### Logout

Use the `Logout` button in the header.

Logout behavior:

- clears the active session
- updates the UI immediately
- removes access to protected routes

## Admin Guide

Admin features are visible only after signing in with an admin account.

### 1. Manage Movies

Go to:

- [http://127.0.0.1:3000/admin/movies](http://127.0.0.1:3000/admin/movies)

What admins can do:

- create movies
- edit movies
- delete movies
- upload poster images

Movie form fields:

- title
- genre
- duration
- description
- poster

Poster handling:

- preview is shown before save
- invalid type or oversized file is rejected

### 2. Manage Showtimes

Go to:

- [http://127.0.0.1:3000/admin/showtimes](http://127.0.0.1:3000/admin/showtimes)

What admins can do:

- choose a movie
- pick a date
- pick a start time
- select a cinema
- select a room
- create a new showtime

Showtime protections:

- the end time is derived from movie runtime
- room choices depend on the selected cinema
- overlapping showtimes in the same room are blocked
- overlap warnings are shown before save

Allowed scheduling rule:

- adjacent showtimes are allowed when one starts exactly when the previous one ends

## Navigation Rules

### For normal users

- `Movies` is visible
- `Tickets` is visible after login
- admin pages are hidden
- direct access to admin routes is blocked

### For admin users

- `Movies`, `Tickets`, and `Admin` are visible
- admin sub-navigation appears on admin pages
- admin routes load normally after authorization is confirmed

## Common States You May See

### Loading

The app uses:

- page skeletons
- button loading states
- route loading indicators

### Empty State

The app shows clear empty states for:

- no movies
- no tickets
- no showtimes

### Error State

The app converts technical API failures into user-friendly messages.

Recoverable screens may show:

- retry buttons
- clear next steps

## Recommended Test Flows

### Basic customer flow

1. Log in as `user@moviehub.test`
2. Open `/movies`
3. Open a movie detail page
4. Choose a showtime
5. Select seats
6. Confirm booking
7. Open `/tickets`

### Basic admin flow

1. Log in as `admin@moviehub.test`
2. Open `/admin/movies`
3. Create or edit a movie
4. Open `/admin/showtimes`
5. Create a showtime
6. Try an overlapping showtime to verify validation

## Troubleshooting

### I cannot access an admin page

Make sure you are logged in with:

- `admin@moviehub.test`

Normal users cannot access admin routes.

### Google login redirects to the wrong place

Local browser testing must use:

- [http://127.0.0.1:3000](http://127.0.0.1:3000)

Do not switch between `localhost` and `127.0.0.1` during local OAuth testing.

### Tickets page is empty

This is expected until at least one booking is confirmed.

### Booking page blocks seat selection

Possible causes:

- the seat is already booked
- the seat is held
- the seat layout is invalid
- you reached the maximum selection limit

## Summary

MovieHub currently supports:

- login and registration
- Google OAuth
- movie browsing
- movie detail and showtimes
- seat selection
- checkout and booking confirmation
- ticket history
- admin movie CRUD
- admin showtime scheduling with overlap protection
