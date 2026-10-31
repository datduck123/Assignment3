package fu.sba301.hotel.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingDetailResponse(
    Integer roomId,
    String roomNumber,
    String roomTypeName,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal actualPrice
) {}
