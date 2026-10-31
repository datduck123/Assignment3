package fu.sba301.hotel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BookingDetail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDetail {

    @EmbeddedId
    private BookingDetailId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingReservationId")
    @JoinColumn(name = "BookingReservationID")
    private BookingReservation bookingReservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("roomId")
    @JoinColumn(name = "RoomID")
    private RoomInformation room;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "ActualPrice", precision = 19, scale = 4) // money type
    private BigDecimal actualPrice;
}
