
//Trần Văn Đạt - CE190117
package fu.sba301.hotel.repository;

import fu.sba301.hotel.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {
    List<BookingReservation> findByCustomer_CustomerIdOrderByBookingDateDesc(Integer customerId);
    List<BookingReservation> findAllByOrderByBookingDateDesc();

    @Query("SELECT COALESCE(MAX(b.bookingReservationId), 0) + 1 FROM BookingReservation b")
    Integer getNextReservationId();
}
