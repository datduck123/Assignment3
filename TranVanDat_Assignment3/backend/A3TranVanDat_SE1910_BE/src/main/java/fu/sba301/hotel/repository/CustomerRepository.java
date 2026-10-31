
//Trần Văn Đạt - CE190117
package fu.sba301.hotel.repository;

import fu.sba301.hotel.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByEmailAddressIgnoreCase(String email);
    boolean existsByEmailAddressIgnoreCase(String email);
    List<Customer> findByCustomerFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(String name, String email);
}
