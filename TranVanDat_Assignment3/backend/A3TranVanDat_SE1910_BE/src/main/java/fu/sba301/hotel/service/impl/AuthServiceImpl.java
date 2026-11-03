
////Trần Văn Đạt - CE190117
package fu.sba301.hotel.service.impl;

import fu.sba301.hotel.dto.request.LoginRequest;
import fu.sba301.hotel.dto.request.RegisterRequest;
import fu.sba301.hotel.dto.response.AuthResponse;
import fu.sba301.hotel.dto.response.CustomerResponse;
import fu.sba301.hotel.entity.Customer;
import fu.sba301.hotel.exception.ConflictException;
import fu.sba301.hotel.repository.CustomerRepository;
import fu.sba301.hotel.security.JwtTokenProvider;
import fu.sba301.hotel.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${fuhotel.staff.email}")
    private String staffEmail;

    @Value("${fuhotel.staff.password}")
    private String staffPassword;

    @Value("${fuhotel.staff.name}")
    private String staffName;

    public AuthServiceImpl(CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim();
        String password = request.password();

        // 1. Kiểm tra Staff account từ application.properties
        if (staffEmail.equalsIgnoreCase(email)) {
            if (!staffPassword.equals(password)) {
                throw new BadCredentialsException("Invalid email or password");
            }
            String token = jwtTokenProvider.generateToken(staffEmail, "ROLE_STAFF", 0, staffName);
            return new AuthResponse(token, 0, staffName, staffEmail, "STAFF");
        }

        // 2. Kiểm tra Customer từ CSDL
        Customer customer = customerRepository.findByEmailAddressIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new BadCredentialsException("Customer account has been disabled or locked");
        }

        String token = jwtTokenProvider.generateToken(
                customer.getEmailAddress(),
                "ROLE_CUSTOMER",
                customer.getCustomerId(),
                customer.getCustomerFullName()
        );

        return new AuthResponse(token, customer.getCustomerId(), customer.getCustomerFullName(), customer.getEmailAddress(), "CUSTOMER");
    }

    @Override
    public CustomerResponse register(RegisterRequest request) {
        if ((staffEmail != null && staffEmail.equalsIgnoreCase(request.emailAddress())) || customerRepository.existsByEmailAddressIgnoreCase(request.emailAddress())) {
            throw new ConflictException("Email address already exists in the system: " + request.emailAddress());
        }

        Customer customer = Customer.builder()
                .customerFullName(request.customerFullName().trim())
                .telephone(request.telephone())
                .emailAddress(request.emailAddress().trim().toLowerCase())
                .customerBirthday(request.customerBirthday())
                .customerStatus((byte) 1) // 1 = Active
                .password(passwordEncoder.encode(request.password()))
                .build();

        Customer saved = customerRepository.save(customer);
        return new CustomerResponse(
                saved.getCustomerId(),
                saved.getCustomerFullName(),
                saved.getTelephone(),
                saved.getEmailAddress(),
                saved.getCustomerBirthday(),
                saved.getCustomerStatus()
        );
    }
}
