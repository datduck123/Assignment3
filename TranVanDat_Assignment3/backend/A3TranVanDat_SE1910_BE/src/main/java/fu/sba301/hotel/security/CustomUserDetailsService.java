
//Trần Văn Đạt - CE190117
package fu.sba301.hotel.security;

import fu.sba301.hotel.entity.Customer;
import fu.sba301.hotel.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    @Value("${fuhotel.staff.email}")
    private String staffEmail;

    @Value("${fuhotel.staff.password}")
    private String staffPassword;

    public CustomUserDetailsService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Kiểm tra tài khoản Staff cấu hình trong application.properties
        if (staffEmail.equalsIgnoreCase(email)) {
            return new User(
                    staffEmail,
                    staffPassword,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_STAFF"))
            );
        }

        // 2. Kiểm tra Customer từ CSDL
        Customer customer = customerRepository.findByEmailAddressIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new DisabledException("Customer account is locked");
        }

        return new User(
                customer.getEmailAddress(),
                customer.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
    }
}
