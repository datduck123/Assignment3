package fu.sba301.hotel.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BookingCreateRequest(
    Integer customerId,

    @NotEmpty(message = "Must select at least one room")
    @Valid
    List<BookingItemRequest> items
) {}
