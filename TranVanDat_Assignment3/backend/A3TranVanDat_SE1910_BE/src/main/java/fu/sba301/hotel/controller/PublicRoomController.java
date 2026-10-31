package fu.sba301.hotel.controller;

import fu.sba301.hotel.dto.response.RoomResponse;
import fu.sba301.hotel.dto.response.RoomTypeResponse;
import fu.sba301.hotel.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicRoomController {

    private final RoomService roomService;

    public PublicRoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponse>> getPublicRooms() {
        return ResponseEntity.ok(roomService.getPublicRooms());
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/room-types")
    public ResponseEntity<List<RoomTypeResponse>> getRoomTypes() {
        return ResponseEntity.ok(roomService.getAllRoomTypes());
    }
}
