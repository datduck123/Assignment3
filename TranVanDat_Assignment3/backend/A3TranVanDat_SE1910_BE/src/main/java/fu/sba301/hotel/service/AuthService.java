package fu.sba301.hotel.service;

import fu.sba301.hotel.dto.request.LoginRequest;
import fu.sba301.hotel.dto.request.RegisterRequest;
import fu.sba301.hotel.dto.response.AuthResponse;
import fu.sba301.hotel.dto.response.CustomerResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    CustomerResponse register(RegisterRequest request);
}
