export const SUPPORTED_LOCALES = ['en', 'vi'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'vi'

export const messages = {
  en: {
    common: {
      platformBadge: 'Movie booking platform',
      viewDetails: 'View details',
      minutesShort: 'mins',
      minutesLong: 'minutes',
      retry: 'Retry',
      remove: 'Remove',
      change: 'Change',
      uploading: 'Uploading',
      noValue: '—',
    },
    nav: {
      movies: 'Movies',
      tickets: 'Tickets',
      admin: 'Admin',
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
    movieDetailPage: {
      loadErrorTitle: 'We could not load this movie',
      loadErrorDescription:
        'Try refreshing the page. If the issue persists, return to the movie list and retry.',
      notFoundDescription: 'Return to the movie list and choose another title.',
      backToMovies: 'Back to movies',
      malformedTitle: 'Movie details are temporarily unavailable',
      malformedDescription:
        'Some required movie fields are missing. Refresh the page or return to the movie list.',
      bookingEntryTitle: 'Booking entry point',
      bookingEntryDescription:
        'Choose a valid showtime below to continue to seat selection.',
      showtimesIntro:
        'Browse upcoming sessions grouped by date. Disabled times are unavailable or invalid and cannot be selected.',
      dateGroupSingular: 'date group',
      dateGroupPlural: 'date groups',
      malformedShowtimes:
        '{count} malformed showtime{suffix} were hidden because their schedule data was invalid.',
      unavailableBanner:
        'All listed showtimes are currently unavailable. Check another date or come back later for new sessions.',
      starts: 'Starts',
      price: 'Price',
      openingBooking: 'Opening booking...',
      showtimeSingular: 'showtime',
      showtimePlural: 'showtimes',
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
    authPages: {
      loginSeoTitle: 'Login',
      loginEyebrow: 'Account',
      loginTitle: 'Sign in to continue booking',
      loginDescription:
        'Use your email and password or continue with Google to return to your booking flow.',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      loginSubmit: 'Login',
      continueWithGoogle: 'Continue with Google',
      noAccount: "Don't have an account?",
      createAccount: 'Create one',
      registeredSuccess: 'Registration successful. You can sign in now.',
      registerSeoTitle: 'Register',
      registerEyebrow: 'Register',
      registerTitle: 'Create your MovieHub account',
      registerDescription:
        'Sign up to save tickets, continue checkout, and grow this authentication flow later with a real backend.',
      fullNameLabel: 'Full name',
      confirmPasswordLabel: 'Confirm password',
      registerSubmit: 'Create account',
      hasAccount: 'Already have an account?',
    },
    profilePage: {
      heroTitle: 'My profile',
      heroDescription:
        'Manage your account details and view your booking activity.',
      uploadPhoto: 'Upload photo',
      changePhoto: 'Change photo',
      profilePhotoAlt: 'Profile photo',
      removePhoto: 'Remove photo',
      administrator: 'Administrator',
      member: 'Member',
      quickLinks: 'Quick links',
      myTickets: 'My tickets',
      adminPanel: 'Admin panel',
      bookingActivity: 'Booking activity',
      total: 'Total',
      bookingsMade: 'bookings made',
      confirmed: 'Confirmed',
      seatsReserved: 'seats reserved',
      cancelled: 'Cancelled',
      bookingsCancelled: 'bookings cancelled',
      totalSpent: 'Total spent',
      acrossConfirmedBookings: 'across all confirmed bookings',
      accountDetails: 'Account details',
      displayName: 'Display name',
      role: 'Role',
    },
    adminMoviesPage: {
      seoTitle: 'Admin Movies',
      heroTitle: 'Admin: Movies',
      heroDescription:
        'Create, edit, delete, and maintain movie catalog entries with poster artwork and validation guardrails.',
      sectionTitle: 'Movie catalog',
      sectionDescription:
        'Manage current movie records, poster artwork, pricing, and metadata from one place.',
      createNew: 'Create new movie',
      emptyTitle: 'No movies in the admin catalog',
      emptyDescription:
        'Create the first movie to start building the booking catalog. New entries will appear here immediately after save.',
      createSuccess: 'Movie created successfully.',
      updateSuccess: 'Movie updated successfully.',
      deleteSuccess: 'Movie deleted successfully.',
      formCreateTitle: 'Create movie',
      formEditTitle: 'Edit movie',
      formCreateDescription:
        'Add a new movie with complete metadata and optional poster artwork.',
      formEditDescription:
        'Update movie metadata, poster artwork, and pricing details without leaving the list.',
      saveChanges: 'Save changes',
      savingChanges: 'Saving changes...',
      deleteDialogTitleFallback: 'Delete movie?',
      deleteDialogTitle: 'Delete {title}?',
      deleteDialogDescription:
        'This removes the movie from the admin catalog. Use this only when the record should no longer be managed here.',
      deleteConfirm: 'Delete movie',
      deleteHeading: 'Confirm delete',
      cancel: 'Cancel',
    },
    movieForm: {
      title: 'Title',
      genre: 'Genre',
      durationMinutes: 'Duration (minutes)',
      rating: 'Rating',
      releaseDate: 'Release date',
      baseTicketPrice: 'Base ticket price',
      status: 'Status',
      statusNowShowing: 'Now showing',
      statusComingSoon: 'Coming soon',
      statusArchived: 'Archived',
      description: 'Description',
      poster: 'Poster',
      reset: 'Reset form',
      placeholderRating: 'PG-13',
    },
    posterUpload: {
      readError: 'Poster file could not be read.',
      invalidType: 'Upload a JPG, PNG, or WebP image.',
      maxSize: 'Poster image must be 2 MB or smaller.',
      uploadFailed: 'Poster upload failed. Try again.',
      previewAlt: 'Poster preview',
      previewTitle: 'Poster preview',
      previewDescription:
        'Upload JPG, PNG, or WebP artwork up to 2 MB. A placeholder will be used if no poster is provided.',
      uploadButton: 'Upload poster',
      uploadingButton: 'Uploading poster...',
      removeButton: 'Remove poster',
    },
    adminMovieCard: {
      posterAlt: '{title} poster',
      noPoster: 'No poster',
      edit: 'Edit movie',
      deleting: 'Deleting...',
      delete: 'Delete movie',
    },
    adminShowtimesPage: {
      seoTitle: 'Admin Showtimes',
      heroTitle: 'Admin: Showtimes',
      heroDescription:
        'Schedule screenings by movie, cinema, and room with overlap protection before the schedule goes live.',
      sectionTitle: 'Current schedule',
      sectionDescription:
        'Review the existing room schedule before adding another screening. Overlap checks are enforced against this schedule on every create.',
      noMoviesTitle: 'No movies available for scheduling',
      noMoviesDescription:
        'Create at least one movie in the admin catalog before scheduling a showtime.',
      noMoviesAction: 'Go to admin movies',
      noCinemasTitle: 'No cinemas available',
      noCinemasDescription:
        'Add a cinema and room catalog before creating showtimes for this admin workspace.',
      noShowtimesTitle: 'No showtimes scheduled yet',
      noShowtimesDescription:
        'Use the form to create the first screening. It will appear here immediately after save.',
      runtime: 'Runtime',
      ticketPrice: 'Ticket price',
      timeWindow: 'Time window',
      to: 'to',
      noRoomsTitle: 'No rooms available for this cinema',
      noRoomsDescription:
        'Choose a different cinema or add rooms to this location before scheduling the showtime.',
      createSuccess: 'Showtime created successfully.',
    },
    adminShowtimeForm: {
      eyebrow: 'Create showtime',
      title: 'Schedule a new screening',
      description:
        'Pick the movie, start time, cinema, and room. The end time is derived from the movie runtime and checked against the room schedule before save.',
      movie: 'Movie',
      selectMovie: 'Select a movie',
      date: 'Date',
      startTime: 'Start time',
      cinema: 'Cinema',
      selectCinema: 'Select a cinema',
      room: 'Room',
      selectRoom: 'Select a room',
      selectCinemaFirst: 'Select a cinema first',
      seatsLabel: '{count} seats',
      ticketPrice: 'Ticket price',
      reset: 'Reset form',
      create: 'Create showtime',
      creating: 'Creating showtime...',
    },
    showtimePreview: {
      eyebrow: 'Showtime preview',
      emptyTitle: 'Complete the schedule details',
      emptyDescription:
        'Select a movie, date, time, cinema, and room to preview the exact runtime window before saving.',
      starts: 'Starts',
      ends: 'Ends',
      cinemaRoom: 'Cinema / Room',
      runtimeCapacity: 'Runtime / Capacity',
      ticketPrice: 'Ticket price',
    },
    overlapWarning: {
      title: 'Scheduling conflict',
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
      retry: 'Thử lại',
      remove: 'Gỡ',
      change: 'Đổi',
      uploading: 'Đang tải lên',
      noValue: '—',
    },
    nav: {
      movies: 'Phim',
      tickets: 'Vé của tôi',
      admin: 'Quản trị',
      adminMovies: 'Quản lý phim',
      adminShowtimes: 'Quản lý suất chiếu',
    },
    footer: {
      tagline: 'Đặt vé nhanh cho các bộ phim và suất chiếu mới nhất',
      copyright: '© 2026 Bảo lưu mọi quyền',
    },
    home: {
      heroTitle: 'Đặt vé xem phim nhanh chóng và dễ dàng',
      heroDescription:
        'Khám phá phim mới, chọn suất chiếu phù hợp và hoàn tất đặt vé trong vài bước đơn giản.',
      featuredTitle: 'Phim nổi bật',
      featuredDescription:
        'Những bộ phim đang được khán giả quan tâm nhất hôm nay.',
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
    movieDetailPage: {
      loadErrorTitle: 'Không thể tải thông tin phim',
      loadErrorDescription:
        'Hãy thử làm mới trang. Nếu lỗi vẫn tiếp diễn, quay lại danh sách phim và thử lại.',
      notFoundDescription: 'Quay lại danh sách phim và chọn một phim khác.',
      backToMovies: 'Quay lại danh sách phim',
      malformedTitle: 'Thông tin phim hiện tạm thời không khả dụng',
      malformedDescription:
        'Một số dữ liệu bắt buộc của phim đang bị thiếu. Hãy làm mới trang hoặc quay lại danh sách phim.',
      bookingEntryTitle: 'Lối vào đặt vé',
      bookingEntryDescription:
        'Hãy chọn một suất chiếu hợp lệ bên dưới để tiếp tục đến bước chọn ghế.',
      showtimesIntro:
        'Xem các suất chiếu sắp tới theo từng ngày. Những khung giờ bị vô hiệu hóa hiện không khả dụng hoặc không hợp lệ.',
      dateGroupSingular: 'nhóm ngày',
      dateGroupPlural: 'nhóm ngày',
      malformedShowtimes:
        'Đã ẩn {count} suất chiếu không hợp lệ vì dữ liệu lịch chiếu bị lỗi.',
      unavailableBanner:
        'Tất cả suất chiếu hiện tại đều chưa khả dụng. Hãy kiểm tra ngày khác hoặc quay lại sau.',
      starts: 'Bắt đầu',
      price: 'Giá',
      openingBooking: 'Đang mở trang đặt vé...',
      showtimeSingular: 'suất chiếu',
      showtimePlural: 'suất chiếu',
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
      emptyDescription:
        'Vé đã mua sẽ xuất hiện ở đây sau khi đặt vé hoàn tất.',
      action: 'Xem phim',
    },
    authPages: {
      loginSeoTitle: 'Đăng nhập',
      loginEyebrow: 'Tài khoản',
      loginTitle: 'Đăng nhập để tiếp tục đặt vé',
      loginDescription:
        'Dùng email và mật khẩu hoặc tiếp tục với Google để quay lại luồng đặt vé của bạn.',
      emailLabel: 'Email',
      passwordLabel: 'Mật khẩu',
      loginSubmit: 'Đăng nhập',
      continueWithGoogle: 'Tiếp tục với Google',
      noAccount: 'Chưa có tài khoản?',
      createAccount: 'Tạo tài khoản',
      registeredSuccess: 'Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.',
      registerSeoTitle: 'Đăng ký',
      registerEyebrow: 'Đăng ký',
      registerTitle: 'Tạo tài khoản MovieHub',
      registerDescription:
        'Đăng ký nhanh để lưu vé, tiếp tục thanh toán và mở rộng luồng xác thực sau này.',
      fullNameLabel: 'Họ và tên',
      confirmPasswordLabel: 'Xác nhận mật khẩu',
      registerSubmit: 'Tạo tài khoản',
      hasAccount: 'Đã có tài khoản?',
    },
    profilePage: {
      heroTitle: 'Hồ sơ của tôi',
      heroDescription:
        'Quản lý thông tin tài khoản và xem hoạt động đặt vé của bạn.',
      uploadPhoto: 'Tải ảnh lên',
      changePhoto: 'Đổi ảnh',
      profilePhotoAlt: 'Ảnh hồ sơ',
      removePhoto: 'Gỡ ảnh',
      administrator: 'Quản trị viên',
      member: 'Thành viên',
      quickLinks: 'Liên kết nhanh',
      myTickets: 'Vé của tôi',
      adminPanel: 'Trang quản trị',
      bookingActivity: 'Hoạt động đặt vé',
      total: 'Tổng',
      bookingsMade: 'lượt đặt vé',
      confirmed: 'Đã xác nhận',
      seatsReserved: 'ghế đã giữ',
      cancelled: 'Đã hủy',
      bookingsCancelled: 'lượt đặt đã hủy',
      totalSpent: 'Tổng chi tiêu',
      acrossConfirmedBookings: 'trên tất cả đơn đã xác nhận',
      accountDetails: 'Thông tin tài khoản',
      displayName: 'Tên hiển thị',
      role: 'Vai trò',
    },
    adminMoviesPage: {
      seoTitle: 'Quản lý phim',
      heroTitle: 'Quản trị: Phim',
      heroDescription:
        'Tạo, chỉnh sửa, xóa và duy trì các mục trong danh mục phim kèm poster và lớp kiểm tra dữ liệu.',
      sectionTitle: 'Danh mục phim',
      sectionDescription:
        'Quản lý phim hiện có, poster, giá vé và metadata tại một nơi.',
      createNew: 'Tạo phim mới',
      emptyTitle: 'Chưa có phim trong danh mục quản trị',
      emptyDescription:
        'Tạo bộ phim đầu tiên để bắt đầu xây dựng danh mục đặt vé. Mục mới sẽ xuất hiện ngay sau khi lưu.',
      createSuccess: 'Tạo phim thành công.',
      updateSuccess: 'Cập nhật phim thành công.',
      deleteSuccess: 'Xóa phim thành công.',
      formCreateTitle: 'Tạo phim',
      formEditTitle: 'Chỉnh sửa phim',
      formCreateDescription:
        'Thêm phim mới với đầy đủ metadata và poster tùy chọn.',
      formEditDescription:
        'Cập nhật metadata, poster và giá vé của phim mà không cần rời khỏi danh sách.',
      saveChanges: 'Lưu thay đổi',
      savingChanges: 'Đang lưu thay đổi...',
      deleteDialogTitleFallback: 'Xóa phim?',
      deleteDialogTitle: 'Xóa {title}?',
      deleteDialogDescription:
        'Thao tác này sẽ xóa phim khỏi danh mục quản trị. Chỉ dùng khi bản ghi này không còn cần được quản lý ở đây.',
      deleteConfirm: 'Xóa phim',
      deleteHeading: 'Xác nhận xóa',
      cancel: 'Hủy',
    },
    movieForm: {
      title: 'Tên phim',
      genre: 'Thể loại',
      durationMinutes: 'Thời lượng (phút)',
      rating: 'Phân loại',
      releaseDate: 'Ngày phát hành',
      baseTicketPrice: 'Giá vé cơ bản',
      status: 'Trạng thái',
      statusNowShowing: 'Đang chiếu',
      statusComingSoon: 'Sắp chiếu',
      statusArchived: 'Lưu trữ',
      description: 'Mô tả',
      poster: 'Poster',
      reset: 'Đặt lại biểu mẫu',
      placeholderRating: 'P-13',
    },
    posterUpload: {
      readError: 'Không thể đọc tệp poster.',
      invalidType: 'Hãy tải lên ảnh JPG, PNG hoặc WebP.',
      maxSize: 'Ảnh poster phải nhỏ hơn hoặc bằng 2 MB.',
      uploadFailed: 'Tải poster thất bại. Vui lòng thử lại.',
      previewAlt: 'Xem trước poster',
      previewTitle: 'Xem trước poster',
      previewDescription:
        'Tải lên ảnh JPG, PNG hoặc WebP tối đa 2 MB. Hệ thống sẽ dùng ảnh mặc định nếu chưa có poster.',
      uploadButton: 'Tải poster lên',
      uploadingButton: 'Đang tải poster...',
      removeButton: 'Gỡ poster',
    },
    adminMovieCard: {
      posterAlt: 'Poster của {title}',
      noPoster: 'Chưa có poster',
      edit: 'Sửa phim',
      deleting: 'Đang xóa...',
      delete: 'Xóa phim',
    },
    adminShowtimesPage: {
      seoTitle: 'Quản lý suất chiếu',
      heroTitle: 'Quản trị: Suất chiếu',
      heroDescription:
        'Lên lịch chiếu theo phim, rạp và phòng với cơ chế chống trùng lịch trước khi công bố.',
      sectionTitle: 'Lịch chiếu hiện tại',
      sectionDescription:
        'Xem lịch phòng hiện có trước khi thêm suất chiếu mới. Kiểm tra chồng chéo được áp dụng cho mỗi lần tạo.',
      noMoviesTitle: 'Chưa có phim để lên lịch',
      noMoviesDescription:
        'Hãy tạo ít nhất một phim trong danh mục quản trị trước khi thêm suất chiếu.',
      noMoviesAction: 'Đi tới quản lý phim',
      noCinemasTitle: 'Chưa có rạp',
      noCinemasDescription:
        'Hãy thêm danh mục rạp và phòng trước khi tạo suất chiếu cho khu vực quản trị này.',
      noShowtimesTitle: 'Chưa có suất chiếu nào',
      noShowtimesDescription:
        'Dùng biểu mẫu để tạo suất chiếu đầu tiên. Nó sẽ xuất hiện ở đây ngay sau khi lưu.',
      runtime: 'Thời lượng',
      ticketPrice: 'Giá vé',
      timeWindow: 'Khung giờ',
      to: 'đến',
      noRoomsTitle: 'Không có phòng cho rạp này',
      noRoomsDescription:
        'Chọn rạp khác hoặc thêm phòng vào địa điểm này trước khi tạo suất chiếu.',
      createSuccess: 'Tạo suất chiếu thành công.',
    },
    adminShowtimeForm: {
      eyebrow: 'Tạo suất chiếu',
      title: 'Lên lịch một suất chiếu mới',
      description:
        'Chọn phim, giờ bắt đầu, rạp và phòng. Giờ kết thúc sẽ được suy ra từ thời lượng phim và kiểm tra với lịch phòng trước khi lưu.',
      movie: 'Phim',
      selectMovie: 'Chọn phim',
      date: 'Ngày',
      startTime: 'Giờ bắt đầu',
      cinema: 'Rạp',
      selectCinema: 'Chọn rạp',
      room: 'Phòng',
      selectRoom: 'Chọn phòng',
      selectCinemaFirst: 'Chọn rạp trước',
      seatsLabel: '{count} ghế',
      ticketPrice: 'Giá vé',
      reset: 'Đặt lại biểu mẫu',
      create: 'Tạo suất chiếu',
      creating: 'Đang tạo suất chiếu...',
    },
    showtimePreview: {
      eyebrow: 'Xem trước suất chiếu',
      emptyTitle: 'Hoàn tất thông tin lịch chiếu',
      emptyDescription:
        'Chọn phim, ngày, giờ, rạp và phòng để xem trước chính xác khung thời gian trước khi lưu.',
      starts: 'Bắt đầu',
      ends: 'Kết thúc',
      cinemaRoom: 'Rạp / Phòng',
      runtimeCapacity: 'Thời lượng / Sức chứa',
      ticketPrice: 'Giá vé',
    },
    overlapWarning: {
      title: 'Xung đột lịch chiếu',
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
