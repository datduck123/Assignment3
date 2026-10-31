
////Trần Văn Đạt - CE190117
package fu.sba301.hotel.service.impl;

import fu.sba301.hotel.dto.request.CustomerUpdateRequest;
import fu.sba301.hotel.dto.response.CustomerResponse;
import fu.sba301.hotel.entity.Customer;
import fu.sba301.hotel.exception.ResourceNotFoundException;
import fu.sba301.hotel.repository.CustomerRepository;
import fu.sba301.hotel.service.CustomerService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerServiceImpl(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers(String keyword) {
        List<Customer> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = customerRepository.findByCustomerFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(keyword.trim(), keyword.trim());
        } else {
            list = customerRepository.findAll();
        }
        return list.stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Integer id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        return mapToResponse(c);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerByEmail(String email) {
        Customer c = customerRepository.findByEmailAddressIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + email));
        return mapToResponse(c);
    }

    @Override
    public CustomerResponse updateProfile(String email, CustomerUpdateRequest request) {
        Customer c = customerRepository.findByEmailAddressIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        c.setCustomerFullName(request.customerFullName().trim());
        c.setTelephone(request.telephone());
        c.setCustomerBirthday(request.customerBirthday());

        if (request.password() != null && !request.password().isBlank()) {
            c.setPassword(passwordEncoder.encode(request.password()));
        }

        return mapToResponse(customerRepository.save(c));
    }

    @Override
    public CustomerResponse updateCustomerByStaff(Integer id, CustomerUpdateRequest request) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));

        c.setCustomerFullName(request.customerFullName().trim());
        c.setTelephone(request.telephone());
        c.setCustomerBirthday(request.customerBirthday());
        if (request.customerStatus() != null) {
            c.setCustomerStatus(request.customerStatus());
        }
        if (request.password() != null && !request.password().isBlank()) {
            c.setPassword(passwordEncoder.encode(request.password()));
        }

        return mapToResponse(customerRepository.save(c));
    }

    @Override
    public void deleteCustomer(Integer id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        c.setCustomerStatus((byte) 0);
        customerRepository.save(c);
    }

    private CustomerResponse mapToResponse(Customer c) {
        return new CustomerResponse(
                c.getCustomerId(),
                c.getCustomerFullName(),
                c.getTelephone(),
                c.getEmailAddress(),
                c.getCustomerBirthday(),
                c.getCustomerStatus()
        );
    }
}
