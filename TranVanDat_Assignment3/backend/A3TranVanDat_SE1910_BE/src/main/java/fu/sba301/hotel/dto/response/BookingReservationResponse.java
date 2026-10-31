package fu.sba301.hotel.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record BookingReservationResponse(
    Integer bookingReservationId,
    LocalDate bookingDate,
    BigDecimal totalPrice,
    Integer customerId,
    String customerFullName,
    String customerEmail,
    Byte bookingStatus,
    List<BookingDetailResponse> details
) {}
