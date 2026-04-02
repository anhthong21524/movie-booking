export const SUPPORTED_LOCALES = ['en', 'vi'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'en'

export const messages = {
  en: {
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
      featuredDescription:
        'Popular releases picked for the homepage experience.',
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
  },
  vi: {
    common: {
      platformBadge: 'Nền tảng đặt vé xem phim',
      viewDetails: 'Xem chi tiết',
      minutesShort: 'phút',
      minutesLong: 'phút',
    },
    nav: {
      movies: 'Phim',
      tickets: 'Vé của tôi',
      adminMovies: 'Quản lý phim',
      adminShowtimes: 'Quản lý suất chiếu',
    },
    footer: {
      tagline: 'Đặt vé nhanh cho các bộ phim và suất chiếu mới nhất',
      copyright: '© 2026 Bảo lưu mọi quyền',
    },
    home: {
      heroTitle: 'Đặt vé xem phim trên nền tảng Nuxt gọn gàng, dễ mở rộng',
      heroDescription:
        'Trải nghiệm đặt vé được tổ chức rõ ràng với routing mạch lạc, state nhẹ và giao diện dễ bảo trì.',
      featuredTitle: 'Phim nổi bật',
      featuredDescription:
        'Những tựa phim được chọn để giới thiệu trên trang chủ.',
      browseAll: 'Xem tất cả phim',
    },
    moviesPage: {
      seoTitle: 'Phim',
      heroTitle: 'Phim đang chiếu',
      heroDescription:
        'Khám phá các bộ phim hiện có, thời gian chiếu và điểm bắt đầu cho luồng đặt vé.',
      duration: 'Thời lượng',
      ticketPrice: 'Giá vé',
      rating: 'Phân loại',
      showtimesTitle: 'Suất chiếu hiện có',
      showtimesDescription:
        'Chọn một suất chiếu để tiếp tục tới bước chọn ghế.',
      startsFrom: 'Giá từ',
      selectSeats: 'Chọn ghế',
      noShowtimesTitle: 'Chưa có suất chiếu',
      noShowtimesDescription:
        'Suất chiếu sẽ xuất hiện ở đây ngay khi lịch chiếu được phát hành.',
      movieNotFound: 'Không tìm thấy phim',
    },
    bookingPage: {
      heroTitle: 'Chọn ghế của bạn',
      heroDescription:
        'Chọn các ghế còn trống cho suất chiếu này trước khi sang bước thanh toán.',
      screen: 'Màn hình',
      summaryTitle: 'Tóm tắt đặt vé',
      showtime: 'Suất chiếu',
      selectableSeats: 'Ghế có thể chọn',
      continueToCheckout: 'Tiếp tục thanh toán',
      showtimeNotFound: 'Không tìm thấy suất chiếu',
    },
    checkoutPage: {
      heroTitle: 'Thanh toán',
      heroDescription:
        'Kiểm tra lại ghế đã chọn và tổng quan đơn đặt vé trước khi xác nhận.',
      selectedSeats: 'Ghế đã chọn',
      paymentSummary: 'Tóm tắt thanh toán',
      total: 'Tổng cộng',
      noBookingTitle: 'Chưa có đơn đặt vé',
      noBookingDescription:
        'Hãy bắt đầu từ một suất chiếu và chọn ghế để tạo thông tin thanh toán.',
      goToMovies: 'Tới trang phim',
    },
    ticketsPage: {
      heroTitle: 'Vé của bạn',
      heroDescription:
        'Theo dõi vé đã đặt, thông tin suất chiếu và lịch sử vé trong tương lai.',
      emptyTitle: 'Chưa có vé nào',
      emptyDescription: 'Vé đã mua sẽ xuất hiện ở đây sau khi đặt vé hoàn tất.',
      action: 'Xem phim',
    },
    adminMoviesPage: {
      heroTitle: 'Quản trị: Phim',
      heroDescription:
        'Quản lý dữ liệu phim, trạng thái phát hành và nội dung hiển thị.',
      emptyTitle: 'Chức năng quản lý phim chưa sẵn sàng',
      emptyDescription:
        'Màn hình này đã sẵn sàng để tích hợp form CRUD và công cụ quản trị qua API.',
    },
    adminShowtimesPage: {
      heroTitle: 'Quản trị: Suất chiếu',
      heroDescription: 'Quản lý lịch chiếu, phòng chiếu và quy tắc định giá.',
      emptyTitle: 'Chức năng quản lý suất chiếu chưa sẵn sàng',
      emptyDescription:
        'Hãy kết nối màn hình này với backend khi API lập lịch đã sẵn sàng.',
    },
    errors: {
      genericTitle: 'Đã xảy ra lỗi',
      genericDescription: 'Ứng dụng gặp lỗi ngoài dự kiến.',
      returnHome: 'Quay về trang chủ',
    },
    catalog: {
      movies: {
        'movie-1': {
          title: 'Thước Phim Cuối',
          description:
            'Một người lưu trữ phim phát hiện cuộn phim có thể phát lại ký ức đã mất với độ chính xác đầy nguy hiểm.',
          genre: 'Khoa học viễn tưởng',
        },
        'movie-2': {
          title: 'Bến Cảng Nửa Đêm',
          description:
            'Một chuyến phà mắc kẹt giữa cơn bão trở thành bối cảnh cho bí ẩn căng thẳng giữa những người xa lạ.',
          genre: 'Bí ẩn',
        },
        'movie-3': {
          title: 'Vệ Tinh Giấy',
          description:
            'Hai anh em biến dự án hội chợ khoa học ở thị trấn nhỏ thành cơ hội chạm tới quỹ đạo.',
          genre: 'Chính kịch',
        },
      },
      showtimes: {
        'showtime-1': { roomName: 'Phòng chiếu A' },
        'showtime-2': { roomName: 'Phòng chiếu B' },
        'showtime-3': { roomName: 'Phòng chiếu C' },
      },
    },
  },
} as const
