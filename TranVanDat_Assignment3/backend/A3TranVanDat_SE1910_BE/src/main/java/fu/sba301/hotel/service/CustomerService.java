
////Trần Văn Đạt - CE190117
package fu.sba301.hotel.service;

import fu.sba301.hotel.dto.request.CustomerUpdateRequest;
import fu.sba301.hotel.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {
    List<CustomerResponse> getAllCustomers(String keyword);
    CustomerResponse getCustomerById(Integer id);
    CustomerResponse getCustomerByEmail(String email);
    CustomerResponse updateProfile(String email, CustomerUpdateRequest request);
    CustomerResponse updateCustomerByStaff(Integer id, CustomerUpdateRequest request);
    void deleteCustomer(Integer id);
}
