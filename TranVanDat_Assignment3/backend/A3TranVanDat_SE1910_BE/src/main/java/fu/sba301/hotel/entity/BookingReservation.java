//Trần Văn Đạt - CE190117
package fu.sba301.hotel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "BookingReservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingReservation {

    // Trong script SQL bảng này KHÔNG có IDENTITY, do đó bỏ @GeneratedValue và tự sinh ID
    @Id
    @Column(name = "BookingReservationID")
    private Integer bookingReservationId;

    @Column(name = "BookingDate")
    private LocalDate bookingDate;

    @Column(name = "TotalPrice", precision = 19, scale = 4) // money type
    private BigDecimal totalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer customer;

    @Column(name = "BookingStatus")
    private Byte bookingStatus; // 1 = Confirmed, 2 = Completed, 0 = Cancelled

    @OneToMany(mappedBy = "bookingReservation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BookingDetail> bookingDetails = new ArrayList<>();
}
