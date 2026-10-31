package fu.sba301.hotel.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record RoomRequest(
    @NotBlank(message = "Room number is required")
    @Size(max = 50, message = "Room number must not exceed 50 characters")
    String roomNumber,

    @Size(max = 220, message = "Description must not exceed 220 characters")
    String roomDetailDescription,

    @NotNull(message = "Max capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    Integer roomMaxCapacity,

    @NotNull(message = "Room type ID is required")
    Integer roomTypeId,

    @NotNull(message = "Room status is required")
    Byte roomStatus,

    @NotNull(message = "Price per day is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    BigDecimal roomPricePerDay
) {}
