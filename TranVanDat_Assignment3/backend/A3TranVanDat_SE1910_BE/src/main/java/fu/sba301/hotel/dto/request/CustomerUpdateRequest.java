package fu.sba301.hotel.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CustomerUpdateRequest(
    @NotBlank(message = "Full name is required")
    @Size(max = 50, message = "Name must not exceed 50 characters")
    String customerFullName,

    @Size(max = 12, message = "Telephone must not exceed 12 characters")
    String telephone,

    LocalDate customerBirthday,
    Byte customerStatus,
    String password
) {}
