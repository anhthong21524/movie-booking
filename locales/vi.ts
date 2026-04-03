export const vi = {
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
    featuredDescription: 'Những tựa phim được chọn để giới thiệu trên trang chủ.',
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
    showtimesDescription: 'Chọn một suất chiếu để tiếp tục tới bước chọn ghế.',
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
    heroDescription: 'Quản lý dữ liệu phim, trạng thái phát hành và nội dung hiển thị.',
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
} as const
