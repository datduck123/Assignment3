//Trần Văn Đạt - CE190117
package fu.sba301.hotel.service.impl;

import fu.sba301.hotel.dto.request.BookingCreateRequest;
import fu.sba301.hotel.dto.request.BookingItemRequest;
import fu.sba301.hotel.dto.request.BookingStatusUpdateRequest;
import fu.sba301.hotel.dto.response.BookingDetailResponse;
import fu.sba301.hotel.dto.response.BookingReservationResponse;
import fu.sba301.hotel.entity.*;
import fu.sba301.hotel.exception.BadRequestException;
import fu.sba301.hotel.exception.ConflictException;
import fu.sba301.hotel.exception.ResourceNotFoundException;
import fu.sba301.hotel.repository.BookingDetailRepository;
import fu.sba301.hotel.repository.BookingReservationRepository;
import fu.sba301.hotel.repository.CustomerRepository;
import fu.sba301.hotel.repository.RoomInformationRepository;
import fu.sba301.hotel.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingReservationRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomRepository;

    public BookingServiceImpl(BookingReservationRepository bookingRepository,
                              BookingDetailRepository bookingDetailRepository,
                              CustomerRepository customerRepository,
                              RoomInformationRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public BookingReservationResponse createBooking(String customerEmail, BookingCreateRequest request) {
        Customer customer;
        if (customerEmail != null && !customerEmail.isBlank()) {
            customer = customerRepository.findByEmailAddressIgnoreCase(customerEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        } else if (request.customerId() != null) {
            customer = customerRepository.findById(request.customerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.customerId()));
        } else {
            throw new BadRequestException("Customer information is required");
        }

        if (request.items() == null || request.items().isEmpty()) {
            throw new BadRequestException("At least one room must be selected for booking");
        }

        // TỰ ĐỘNG SINH KHÓA CHÍNH
        Integer nextReservationId = bookingRepository.getNextReservationId();

        BookingReservation reservation = BookingReservation.builder()
                .bookingReservationId(nextReservationId)
                .bookingDate(LocalDate.now())
                .customer(customer)
                .bookingStatus((byte) 1) // 1 = Confirmed
                .totalPrice(BigDecimal.ZERO)
                .bookingDetails(new ArrayList<>())
                .build();

        BigDecimal grandTotal = BigDecimal.ZERO;

        for (BookingItemRequest item : request.items()) {
            if (item.startDate().isAfter(item.endDate()) || item.startDate().isEqual(item.endDate())) {
                throw new BadRequestException("End date must be strictly after Start date");
            }

            RoomInformation room = roomRepository.findById(item.roomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + item.roomId()));

            if (room.getRoomStatus() != null && room.getRoomStatus() == 0) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is currently inactive or under maintenance");
            }

            // Kiểm tra va chạm ngày thuê
            boolean occupied = bookingDetailRepository.isRoomOccupied(item.roomId(), item.startDate(), item.endDate());
            if (occupied) {
                throw new ConflictException("Room " + room.getRoomNumber() + " is already booked for the selected date range!");
            }

            long days = ChronoUnit.DAYS.between(item.startDate(), item.endDate());
            BigDecimal roomTotal = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
            grandTotal = grandTotal.add(roomTotal);

            BookingDetail detail = BookingDetail.builder()
                    .id(new BookingDetailId(nextReservationId, room.getRoomId()))
                    .bookingReservation(reservation)
                    .room(room)
                    .startDate(item.startDate())
                    .endDate(item.endDate())
                    .actualPrice(roomTotal)
                    .build();

            reservation.getBookingDetails().add(detail);
        }

        reservation.setTotalPrice(grandTotal);
        BookingReservation saved = bookingRepository.save(reservation);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingReservationResponse> getCustomerBookingHistory(String customerEmail) {
        Customer customer = customerRepository.findByEmailAddressIgnoreCase(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return bookingRepository.findByCustomer_CustomerIdOrderByBookingDateDesc(customer.getCustomerId())
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingReservationResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc()
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingReservationResponse getBookingById(Integer id) {
        BookingReservation b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found: " + id));
        return mapToResponse(b);
    }

    @Override
    public BookingReservationResponse updateBookingStatus(Integer id, BookingStatusUpdateRequest request) {
        BookingReservation b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reservation not found: " + id));
        b.setBookingStatus(request.bookingStatus());
        return mapToResponse(bookingRepository.save(b));
    }

    private BookingReservationResponse mapToResponse(BookingReservation r) {
        List<BookingDetailResponse> details = r.getBookingDetails().stream().map(d -> new BookingDetailResponse(
                d.getRoom().getRoomId(),
                d.getRoom().getRoomNumber(),
                d.getRoom().getRoomType().getRoomTypeName(),
                d.getStartDate(),
                d.getEndDate(),
                d.getActualPrice()
        )).toList();

        return new BookingReservationResponse(
                r.getBookingReservationId(),
                r.getBookingDate(),
                r.getTotalPrice(),
                r.getCustomer().getCustomerId(),
                r.getCustomer().getCustomerFullName(),
                r.getCustomer().getEmailAddress(),
                r.getBookingStatus(),
                details
        );
    }
}
