package fu.sba301.hotel.repository;

import fu.sba301.hotel.entity.BookingDetail;
import fu.sba301.hotel.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {
    
    // Kiểm tra xem phòng đã từng được thuê chưa (phục vụ logic xóa vs cập nhật status)
    boolean existsByRoom_RoomId(Integer roomId);

    // Kiểm tra trùng lịch đặt phòng (Collision checking)
    @Query("""
        SELECT COUNT(bd) > 0 FROM BookingDetail bd
        WHERE bd.room.roomId = :roomId
          AND bd.bookingReservation.bookingStatus != 0
          AND NOT (bd.endDate <= :startDate OR bd.startDate >= :endDate)
    """)
    boolean isRoomOccupied(
        @Param("roomId") Integer roomId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
