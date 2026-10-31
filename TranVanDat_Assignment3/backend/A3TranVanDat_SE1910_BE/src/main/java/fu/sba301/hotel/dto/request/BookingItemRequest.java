package fu.sba301.hotel.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record BookingItemRequest(
    @NotNull(message = "Room ID is required")
    Integer roomId,

    @NotNull(message = "Start date is required")
    LocalDate startDate,

    @NotNull(message = "End date is required")
    LocalDate endDate
) {}
