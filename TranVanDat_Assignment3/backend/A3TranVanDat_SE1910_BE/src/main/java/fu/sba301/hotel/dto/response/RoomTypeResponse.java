package fu.sba301.hotel.dto.response;

public record RoomTypeResponse(
    Integer roomTypeId,
    String roomTypeName,
    String typeDescription,
    String typeNote
) {}
