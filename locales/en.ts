export const en = {
  common: {
    platformBadge: 'Movie booking platform',
    viewDetails: 'View details',
    minutesShort: 'mins',
    minutesLong: 'minutes',
  },
  nav: {
    movies: 'Movies',
    tickets: 'Tickets',
    adminMovies: 'Admin Movies',
    adminShowtimes: 'Admin Showtimes',
  },
  footer: {
    tagline: 'Book tickets for the latest movies and showtimes',
    copyright: '© 2026 All rights reserved',
  },
  home: {
    heroTitle: 'Book movies with a clean Nuxt foundation',
    heroDescription:
      'A streamlined movie booking experience with clear routing, lightweight state, and a maintainable UI foundation.',
    featuredTitle: 'Featured movies',
    featuredDescription: 'Popular releases picked for the homepage experience.',
    browseAll: 'Browse all movies',
  },
  moviesPage: {
    seoTitle: 'Movies',
    heroTitle: 'Now showing',
    heroDescription:
      'Discover current releases, session times, and booking entry points in one place.',
    duration: 'Duration',
    ticketPrice: 'Ticket price',
    rating: 'Rating',
    showtimesTitle: 'Available showtimes',
    showtimesDescription: 'Choose a session and continue to seat selection.',
    startsFrom: 'Starts from',
    selectSeats: 'Select seats',
    noShowtimesTitle: 'No showtimes yet',
    noShowtimesDescription:
      'Showtimes will appear here as soon as the schedule is published.',
    movieNotFound: 'Movie not found',
  },
  bookingPage: {
    heroTitle: 'Select your seats',
    heroDescription:
      'Choose available seats for this session before moving to checkout.',
    screen: 'Screen',
    summaryTitle: 'Booking summary',
    showtime: 'Showtime',
    selectableSeats: 'Selectable seats',
    continueToCheckout: 'Continue to checkout',
    showtimeNotFound: 'Showtime not found',
  },
  checkoutPage: {
    heroTitle: 'Checkout',
    heroDescription:
      'Review your selected seats and confirm the booking summary.',
    selectedSeats: 'Selected seats',
    paymentSummary: 'Payment summary',
    total: 'Total',
    noBookingTitle: 'No booking in progress',
    noBookingDescription:
      'Start from a showtime and select seats to populate checkout details.',
    goToMovies: 'Go to movies',
  },
  ticketsPage: {
    heroTitle: 'Your tickets',
    heroDescription:
      'Access upcoming bookings, ticket details, and future ticket history.',
    emptyTitle: 'No tickets yet',
    emptyDescription:
      'Purchased tickets will appear here once a booking is completed.',
    action: 'Browse movies',
  },
  adminMoviesPage: {
    heroTitle: 'Admin: Movies',
    heroDescription:
      'Manage movie records, publishing status, and content updates.',
    emptyTitle: 'Movie management is not available yet',
    emptyDescription:
      'This screen is ready for CRUD forms and API-backed management tools.',
  },
  adminShowtimesPage: {
    heroTitle: 'Admin: Showtimes',
    heroDescription:
      'Manage schedules, auditorium assignments, and pricing rules.',
    emptyTitle: 'Showtime management is not available yet',
    emptyDescription:
      'Connect this screen to your backend when scheduling endpoints are ready.',
  },
  errors: {
    genericTitle: 'Something went wrong',
    genericDescription: 'An unexpected application error occurred.',
    returnHome: 'Return home',
  },
  catalog: {
    movies: {
      'movie-1': {
        title: 'The Last Projection',
        description:
          'A cinema archivist discovers a reel that can replay lost memories with dangerous accuracy.',
        genre: 'Sci-Fi Thriller',
      },
      'movie-2': {
        title: 'Midnight Harbor',
        description:
          'A storm-bound ferry becomes the setting for a tightly wound mystery between strangers.',
        genre: 'Mystery',
      },
      'movie-3': {
        title: 'Paper Satellites',
        description:
          'Two siblings turn a small-town science fair project into an improbable shot at orbit.',
        genre: 'Drama',
      },
    },
    showtimes: {
      'showtime-1': { roomName: 'Auditorium A' },
      'showtime-2': { roomName: 'Auditorium B' },
      'showtime-3': { roomName: 'Auditorium C' },
    },
  },
} as const
