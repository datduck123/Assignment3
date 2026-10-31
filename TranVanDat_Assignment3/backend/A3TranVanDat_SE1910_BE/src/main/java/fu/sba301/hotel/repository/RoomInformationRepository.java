
//Trần Văn Đạt - CE190117
package fu.sba301.hotel.repository;

import fu.sba301.hotel.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {
    List<RoomInformation> findByRoomStatus(Byte roomStatus);
    boolean existsByRoomNumber(String roomNumber);
    List<RoomInformation> findByRoomNumberContainingIgnoreCaseOrRoomDetailDescriptionContainingIgnoreCase(String number, String desc);
}
