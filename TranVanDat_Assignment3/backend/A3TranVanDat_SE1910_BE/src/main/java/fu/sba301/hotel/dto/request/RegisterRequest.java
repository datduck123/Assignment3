package fu.sba301.hotel.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(
    @NotBlank(message = "Full name is required")
    @Size(max = 50, message = "Name must not exceed 50 characters")
    String customerFullName,

    @Size(max = 12, message = "Telephone must not exceed 12 characters")
    String telephone,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 50, message = "Email must not exceed 50 characters")
    String emailAddress,

    LocalDate customerBirthday,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password
) {}
