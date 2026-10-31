
//Trần Văn Đạt - CE190117
package fu.sba301.hotel.service;

import fu.sba301.hotel.dto.request.BookingCreateRequest;
import fu.sba301.hotel.dto.request.BookingStatusUpdateRequest;
import fu.sba301.hotel.dto.response.BookingReservationResponse;

import java.util.List;

public interface BookingService {
    BookingReservationResponse createBooking(String customerEmail, BookingCreateRequest request);
    List<BookingReservationResponse> getCustomerBookingHistory(String customerEmail);
    List<BookingReservationResponse> getAllBookings();
    BookingReservationResponse getBookingById(Integer id);
    BookingReservationResponse updateBookingStatus(Integer id, BookingStatusUpdateRequest request);
}
