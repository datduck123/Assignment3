package fu.sba301.hotel.controller;

import fu.sba301.hotel.dto.request.BookingCreateRequest;
import fu.sba301.hotel.dto.request.CustomerUpdateRequest;
import fu.sba301.hotel.dto.response.BookingReservationResponse;
import fu.sba301.hotel.dto.response.CustomerResponse;
import fu.sba301.hotel.service.BookingService;
import fu.sba301.hotel.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerPortalController {

    private final CustomerService customerService;
    private final BookingService bookingService;

    public CustomerPortalController(CustomerService customerService, BookingService bookingService) {
        this.customerService = customerService;
        this.bookingService = bookingService;
    }

    @GetMapping("/profile")
    public ResponseEntity<CustomerResponse> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(customerService.getCustomerByEmail(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<CustomerResponse> updateMyProfile(Authentication auth,
                                                            @Valid @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(customerService.updateProfile(auth.getName(), request));
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingReservationResponse> createBooking(Authentication auth,
                                                                    @Valid @RequestBody BookingCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(auth.getName(), request));
    }

    @GetMapping("/bookings/history")
    public ResponseEntity<List<BookingReservationResponse>> getMyBookingHistory(Authentication auth) {
        return ResponseEntity.ok(bookingService.getCustomerBookingHistory(auth.getName()));
    }
}
