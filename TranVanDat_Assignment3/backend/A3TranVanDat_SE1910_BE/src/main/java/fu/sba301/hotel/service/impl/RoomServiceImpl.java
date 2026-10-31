//Trần Văn Đạt - CE190117
package fu.sba301.hotel.service.impl;

import fu.sba301.hotel.dto.request.RoomRequest;
import fu.sba301.hotel.dto.response.RoomResponse;
import fu.sba301.hotel.dto.response.RoomTypeResponse;
import fu.sba301.hotel.entity.RoomInformation;
import fu.sba301.hotel.entity.RoomType;
import fu.sba301.hotel.exception.ConflictException;
import fu.sba301.hotel.exception.ResourceNotFoundException;
import fu.sba301.hotel.repository.BookingDetailRepository;
import fu.sba301.hotel.repository.RoomInformationRepository;
import fu.sba301.hotel.repository.RoomTypeRepository;
import fu.sba301.hotel.service.RoomService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomInformationRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingDetailRepository bookingDetailRepository;

    public RoomServiceImpl(RoomInformationRepository roomRepository,
                           RoomTypeRepository roomTypeRepository,
                           BookingDetailRepository bookingDetailRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.bookingDetailRepository = bookingDetailRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getPublicRooms() {
        return roomRepository.findByRoomStatus((byte) 1)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms(String keyword) {
        List<RoomInformation> rooms;
        if (keyword != null && !keyword.trim().isEmpty()) {
            rooms = roomRepository.findByRoomNumberContainingIgnoreCaseOrRoomDetailDescriptionContainingIgnoreCase(keyword.trim(), keyword.trim());
        } else {
            rooms = roomRepository.findAll();
        }
        return rooms.stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Integer id) {
        RoomInformation r = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
        return mapToResponse(r);
    }

    @Override
    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.roomNumber())) {
            throw new ConflictException("Room number already exists: " + request.roomNumber());
        }

        RoomType type = roomTypeRepository.findById(request.roomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found: " + request.roomTypeId()));

        RoomInformation room = RoomInformation.builder()
                .roomNumber(request.roomNumber().trim())
                .roomDetailDescription(request.roomDetailDescription())
                .roomMaxCapacity(request.roomMaxCapacity())
                .roomType(type)
                .roomStatus(request.roomStatus())
                .roomPricePerDay(request.roomPricePerDay())
                .build();

        return mapToResponse(roomRepository.save(room));
    }

    @Override
    public RoomResponse updateRoom(Integer id, RoomRequest request) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));

        if (!room.getRoomNumber().equalsIgnoreCase(request.roomNumber()) && roomRepository.existsByRoomNumber(request.roomNumber())) {
            throw new ConflictException("Room number already exists: " + request.roomNumber());
        }

        RoomType type = roomTypeRepository.findById(request.roomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found: " + request.roomTypeId()));

        room.setRoomNumber(request.roomNumber().trim());
        room.setRoomDetailDescription(request.roomDetailDescription());
        room.setRoomMaxCapacity(request.roomMaxCapacity());
        room.setRoomType(type);
        room.setRoomStatus(request.roomStatus());
        room.setRoomPricePerDay(request.roomPricePerDay());

        return mapToResponse(roomRepository.save(room));
    }

    @Override
    public void deleteRoom(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));

        // YÊU CẦU ĐẶC THÙ ASSIGNMENT 03:
        // "The delete action will delete room information in the case this information is not belong to any renting transaction.
        // If the room information is already stored in a booking detail, just change the status."
        boolean isRented = bookingDetailRepository.existsByRoom_RoomId(id);
        if (isRented) {
            room.setRoomStatus((byte) 0); // Đã từng thuê -> Chỉ đổi status
            roomRepository.save(room);
        } else {
            roomRepository.delete(room);  // Chưa từng thuê -> Xóa hẳn
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomTypeResponse> getAllRoomTypes() {
        return roomTypeRepository.findAll().stream()
                .map(t -> new RoomTypeResponse(t.getRoomTypeId(), t.getRoomTypeName(), t.getTypeDescription(), t.getTypeNote()))
                .toList();
    }

    private RoomResponse mapToResponse(RoomInformation r) {
        return new RoomResponse(
                r.getRoomId(),
                r.getRoomNumber(),
                r.getRoomDetailDescription(),
                r.getRoomMaxCapacity(),
                r.getRoomType().getRoomTypeId(),
                r.getRoomType().getRoomTypeName(),
                r.getRoomStatus(),
                r.getRoomPricePerDay()
        );
    }
}
