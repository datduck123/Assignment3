package fu.sba301.hotel.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class BookingDetailId implements Serializable {

    @Column(name = "BookingReservationID")
    private Integer bookingReservationId;

    @Column(name = "RoomID")
    private Integer roomId;
}
