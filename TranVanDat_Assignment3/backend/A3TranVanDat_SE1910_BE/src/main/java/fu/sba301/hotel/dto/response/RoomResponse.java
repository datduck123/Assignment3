package fu.sba301.hotel.dto.response;

import java.math.BigDecimal;

public record RoomResponse(
    Integer roomId,
    String roomNumber,
    String roomDetailDescription,
    Integer roomMaxCapacity,
    Integer roomTypeId,
    String roomTypeName,
    Byte roomStatus,
    BigDecimal roomPricePerDay
) {}
