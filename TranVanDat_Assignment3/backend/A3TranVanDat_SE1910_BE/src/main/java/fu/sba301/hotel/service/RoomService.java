package fu.sba301.hotel.service;

import fu.sba301.hotel.dto.request.RoomRequest;
import fu.sba301.hotel.dto.response.RoomResponse;
import fu.sba301.hotel.dto.response.RoomTypeResponse;

import java.util.List;

public interface RoomService {
    List<RoomResponse> getPublicRooms();
    List<RoomResponse> getAllRooms(String keyword);
    RoomResponse getRoomById(Integer id);
    RoomResponse createRoom(RoomRequest request);
    RoomResponse updateRoom(Integer id, RoomRequest request);
    void deleteRoom(Integer id);
    List<RoomTypeResponse> getAllRoomTypes();
}
