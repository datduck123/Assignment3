package fu.sba301.hotel.dto.request;

import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(
    @NotNull(message = "Booking status is required")
    Byte bookingStatus
) {}
