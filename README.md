# FU MINI HOTEL MANAGEMENT SYSTEM (SBA301 - ASSIGNMENT 03)

Hệ thống quản lý khách sạn mini (**FUMiniHotelManagement System**) được phát triển theo mô hình ứng dụng Fullstack tách biệt: **Backend RESTful API** (Spring Boot 3, Spring Data JPA, MS SQL Server, Spring Security kết hợp JSON Web Token - JWT) và **Frontend Single Page Application** (ReactJS, Vite, Axios, React Router v6).

## 1. TỔNG QUAN CÔNG NGHỆ (TECH STACK)

* **Backend (REST API Service):**
* **Framework / Language:** Java 21, Spring Boot 3.3.x.


* **Database & ORM:** MS SQL Server, Spring Data JPA (Hibernate).


* **Security & Auth:** Spring Security (Stateless Session) kết hợp JSON Web Token (`jjwt 0.12.6`), mã hóa mật khẩu bằng BCrypt (`BCryptPasswordEncoder`).


* **Kiến trúc:** 3-Layer with Repository Architecture (Controller $\rightarrow$ Service Interface & Impl $\rightarrow$ Repository $\rightarrow$ Database Entity).


* **Tài liệu API:** OpenAPI 3.0 / Swagger UI (`springdoc-openapi`).


* **Frontend (Single Page Application):**
* **Framework / Language:** ReactJS 18, Vite.


* **Giao tiếp mạng:** Axios Client với Request & Response Interceptors.


* **Định tuyến & Phân quyền:** React Router v6 kết hợp `ProtectedRoute` (STAFF / CUSTOMER).


* **Styling:** CSS3 thuần với thiết kế hệ thống thẻ, bố cục Responsive, Modal Dialogs và trạng thái Badge màu sắc.





---

## 2. PHÂN QUYỀN & RÀNG BUỘC NGHIỆP VỤ CỐT LÕI

Hệ thống hiện thực hóa trọn vẹn các yêu cầu theo đặc tả của đề bài:

1. **Khách vãng lai (Public / Unauthenticated):**
* Truy cập trực tiếp cổng danh mục phòng (`GET /api/rooms`, `GET /api/room-types`) để xem danh sách phòng trống, mô tả, sức chứa và giá tiền mà **không cần đăng nhập**.




2. **Khách hàng (Customer - ROLE_CUSTOMER):**
* Đăng ký tài khoản trực tuyến (`/register`) và đăng nhập bằng Email/Password qua cơ chế Stateless JWT.


* Thực hiện đặt phòng online (`/customer/book`) với khả năng chọn đồng thời một hoặc nhiều phòng trong một giao dịch.


* Quản lý thông tin hồ sơ cá nhân (`/customer/profile`).


* Tra cứu lịch sử các đơn đặt phòng của chính mình (`/customer/history`).




3. **Nhân viên (Staff - ROLE_STAFF):**
* Thông tin tài khoản nhân viên được **cấu hình trực tiếp trong tệp `application.properties**` (`fuhotel.staff.email` / `fuhotel.staff.password`).


* Quản lý thông tin khách hàng (CRUD, tìm kiếm, vô hiệu hóa tài khoản).


* Quản lý danh mục phòng (CRUD & Search).


* Quản lý toàn bộ giao dịch đặt phòng, tạo đơn đặt phòng offline và cập nhật trạng thái đơn (Confirmed, Completed, Cancelled).




4. **Quy tắc nghiệp vụ xóa phòng (Room Deletion Rule):**
* Nếu phòng **chưa từng phát sinh giao dịch thuê phòng** (`BookingDetail`): Cho phép xóa vĩnh viễn khỏi CSDL.


* Nếu phòng **đã từng nằm trong chi tiết đặt phòng**: Hệ thống tự động **chỉ chuyển trạng thái phòng sang Inactive (`RoomStatus = 0`)** nhằm bảo vệ tính toàn vẹn tham chiếu của lịch sử giao dịch.




5. **Kiểm tra va chạm lịch thuê (Collision Checking):**
* Chặn không cho phép đặt phòng trùng lịch nếu phòng đó đã được đặt và đơn đặt phòng chưa bị hủy (`BookingStatus != 0`).



---

## 3. CƠ SỞ DỮ LIỆU & ÁNH XẠ JPA (MS SQL SERVER)

Hệ thống được thiết kế và đồng bộ chuẩn xác với cấu trúc CSDL `FUMiniHotelManagement`:

* **`RoomType`:** `RoomTypeID` (PK, Identity), `RoomTypeName`, `TypeDescription`, `TypeNote`.


* **`RoomInformation`:** `RoomID` (PK, Identity), `RoomNumber`, `RoomDetailDescription`, `RoomMaxCapacity`, `RoomTypeID` (FK), `RoomStatus`, `RoomPricePerDay` (money/BigDecimal).


* **`Customer`:** `CustomerID` (PK, Identity), `CustomerFullName`, `Telephone`, `EmailAddress` (Unique), `CustomerBirthday`, `CustomerStatus`, `Password`.


* **`BookingReservation`:** `BookingReservationID` (PK - **Không có Identity** trong SQL script, tự sinh mã tuần tự qua `COALESCE(MAX, 0) + 1`), `BookingDate`, `TotalPrice`, `CustomerID` (FK), `BookingStatus`.


* **`BookingDetail`:** Khóa phức hợp `BookingDetailId` (`BookingReservationID`, `RoomID`), `StartDate`, `EndDate`, `ActualPrice`.



---

## 4. TÀI KHOẢN ĐĂNG NHẬP KIỂM THỬ (TEST ACCOUNTS)

| Vai trò | Email đăng nhập | Mật khẩu | Nguồn dữ liệu |
| --- | --- | --- | --- |
| **Staff (Admin)**

 | `staff@fuhotel.com` | `Staff@123456` | Cấu hình tĩnh tại `application.properties`

 |
| **Customer (Mẫu)**

 | *(Đăng ký tài khoản mới qua form `/register`)* | *(Tối thiểu 6 ký tự)* | Bảng `Customer` trong MS SQL Server

 |

---

## 5. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY HỆ THỐNG

### Bước 1: Chuẩn bị Cơ sở dữ liệu

1. Mở SQL Server Management Studio (SSMS).
2. Mở file script `Assignment 02_FUMiniHotelManagement.sql` và nhấn **Execute** để tạo cơ sở dữ liệu `FUMiniHotelManagement` cùng 5 bảng.


3. Chạy thêm câu lệnh sau để đảm bảo cột mật khẩu chứa đủ độ dài của chuỗi mã hóa BCrypt:


```sql
USE [FUMiniHotelManagement];
ALTER TABLE [dbo].[Customer] ALTER COLUMN [Password] NVARCHAR(120) NULL;
GO

```



### Bước 2: Khởi động Backend (Spring Boot 3)

1. Mở thư mục `A3TranVanDat_SE1910_BE` bằng IntelliJ IDEA.
2. Kiểm tra thông tin kết nối CSDL tại `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=FUMiniHotelManagement;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=123456

```


3. Chạy file khởi tạo ứng dụng: `fu.sba301.hotel.A3Application.java`.
4. Sau khi khởi động thành công trên cổng `8080`, truy cập tài liệu Swagger UI để kiểm thử nhanh các endpoint:
* **Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **OpenAPI Docs:** `http://localhost:8080/v3/api-docs`



### Bước 3: Khởi động Frontend (ReactJS)

1. Mở terminal tại thư mục `A3TranVanDat_SE1910_FE`.
2. Cài đặt các gói phụ thuộc:
```bash
npm install

```


3. Khởi chạy máy chủ phát triển Vite:
```bash
npm run dev

```


4. Truy cập giao diện ứng dụng trên trình duyệt web tại địa chỉ: `http://localhost:5173`.

---

## 6. DANH MỤC ENDPOINTS CHÍNH CỦA HỆ THỐNG (API REFERENCE)

### Xác thực & Tài khoản (Public & Auth)



* `POST /api/auth/login`: Xác thực đăng nhập cho Staff và Customer, trả về JWT Token.


* `POST /api/auth/register`: Đăng ký tài khoản Customer mới.



### Danh mục phòng công khai (Public)



* `GET /api/rooms`: Lấy danh sách toàn bộ các phòng đang hoạt động (`RoomStatus = 1`).


* `GET /api/rooms/{id}`: Xem chi tiết một phòng.


* `GET /api/room-types`: Lấy danh sách loại phòng.



### Phân hệ Khách hàng (`/api/customer/**` - Yêu cầu Token Customer)



* `GET /api/customer/profile`: Xem thông tin tài khoản cá nhân.


* `PUT /api/customer/profile`: Cập nhật thông tin cá nhân và mật khẩu mới.


* `POST /api/customer/bookings`: Tạo đơn đặt phòng trực tuyến (hỗ trợ chọn nhiều phòng).


* `GET /api/customer/bookings/history`: Xem toàn bộ lịch sử đặt phòng của bản thân.



### Phân hệ Nhân viên (`/api/staff/**` - Yêu cầu Token Staff)



* `GET /api/staff/customers`: Danh sách và tìm kiếm khách hàng.


* `PUT /api/staff/customers/{id}`: Chỉnh sửa thông tin / trạng thái khách hàng.


* `DELETE /api/staff/customers/{id}`: Khóa / Vô hiệu hóa tài khoản khách hàng.


* `GET /api/staff/rooms`: Danh sách và tìm kiếm toàn bộ phòng.


* `POST /api/staff/rooms`: Thêm phòng mới.


* `PUT /api/staff/rooms/{id}`: Cập nhật thông tin phòng.


* `DELETE /api/staff/rooms/{id}`: Xóa phòng (Xóa hẳn nếu chưa thuê, đổi status nếu đã thuê).


* `GET /api/staff/bookings`: Xem danh sách tất cả các đơn đặt phòng của hệ thống.


* `POST /api/staff/bookings`: Tạo đơn đặt phòng offline cho khách.


* `PATCH /api/staff/bookings/{id}/status`: Cập nhật trạng thái đơn đặt phòng.
