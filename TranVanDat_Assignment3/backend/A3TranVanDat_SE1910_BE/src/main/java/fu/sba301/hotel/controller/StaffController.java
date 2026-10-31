
//Trần Văn Đạt - CE190117
package fu.sba301.hotel.controller;

import fu.sba301.hotel.dto.request.BookingCreateRequest;
import fu.sba301.hotel.dto.request.BookingStatusUpdateRequest;
import fu.sba301.hotel.dto.request.CustomerUpdateRequest;
import fu.sba301.hotel.dto.request.RoomRequest;
import fu.sba301.hotel.dto.response.BookingReservationResponse;
import fu.sba301.hotel.dto.response.CustomerResponse;
import fu.sba301.hotel.dto.response.RoomResponse;
import fu.sba301.hotel.service.BookingService;
import fu.sba301.hotel.service.CustomerService;
import fu.sba301.hotel.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final CustomerService customerService;
    private final RoomService roomService;
    private final BookingService bookingService;

    public StaffController(CustomerService customerService, RoomService roomService, BookingService bookingService) {
        this.customerService = customerService;
        this.roomService = roomService;
        this.bookingService = bookingService;
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerResponse>> getCustomers(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(customerService.getAllCustomers(keyword));
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable Integer id,
                                                           @Valid @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(customerService.updateCustomerByStaff(id, request));
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getRooms(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(roomService.getAllRooms(keyword));
    }

    @PostMapping("/rooms")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(request));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Integer id, @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingReservationResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<BookingReservationResponse> getBookingById(@PathVariable Integer id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingReservationResponse> createOfflineBooking(@Valid @RequestBody BookingCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(null, request));
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<BookingReservationResponse> updateStatus(@PathVariable Integer id,
                                                                   @Valid @RequestBody BookingStatusUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }
}
