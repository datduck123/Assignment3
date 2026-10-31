//Trần Văn Đạt - CE190117
package fu.sba301.hotel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CustomerID")
    private Integer customerId;

    @Column(name = "CustomerFullName", length = 50)
    private String customerFullName;

    @Column(name = "Telephone", length = 12)
    private String telephone;

    @Column(name = "EmailAddress", length = 50, unique = true, nullable = false)
    private String emailAddress;

    @Column(name = "CustomerBirthday")
    private LocalDate customerBirthday;

    @Column(name = "CustomerStatus")
    private Byte customerStatus; // 1 = Active, 0 = Disabled

    // Lưu ý: script gốc nvarchar(50), để tương thích BCrypt 60 chars ta dùng length 120
    @Column(name = "Password", length = 120)
    private String password;
}
