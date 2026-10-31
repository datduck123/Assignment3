package fu.sba301.hotel.dto.response;

import java.time.LocalDate;

public record CustomerResponse(
    Integer customerId,
    String customerFullName,
    String telephone,
    String emailAddress,
    LocalDate customerBirthday,
    Byte customerStatus
) {}
