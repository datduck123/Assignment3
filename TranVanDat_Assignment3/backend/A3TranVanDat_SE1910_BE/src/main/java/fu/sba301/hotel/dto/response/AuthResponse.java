package fu.sba301.hotel.dto.response;

public record AuthResponse(
    String token,
    String tokenType,
    Integer id,
    String name,
    String email,
    String role
) {
    public AuthResponse(String token, Integer id, String name, String email, String role) {
        this(token, "Bearer", id, name, email, role);
    }
}
