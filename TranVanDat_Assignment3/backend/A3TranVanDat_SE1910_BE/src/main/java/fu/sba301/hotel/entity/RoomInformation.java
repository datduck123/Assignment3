//Trần Văn Đạt - CE190117
package fu.sba301.hotel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "RoomInformation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer roomId;

    @Column(name = "RoomNumber", length = 50, nullable = false)
    private String roomNumber;

    @Column(name = "RoomDetailDescription", length = 220)
    private String roomDetailDescription;

    @Column(name = "RoomMaxCapacity")
    private Integer roomMaxCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoomTypeID", nullable = false)
    private RoomType roomType;

    @Column(name = "RoomStatus")
    private Byte roomStatus; // 1 = Active, 0 = Inactive

    @Column(name = "RoomPricePerDay", precision = 19, scale = 4) // SQL Server money type
    private BigDecimal roomPricePerDay;
}
