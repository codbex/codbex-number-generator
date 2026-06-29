package gen.codbex_number_generator.data.settings;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_NUMBER")
@Documentation("Number entity mapping")
public class NumberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NUMBER_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "NUMBER_TYPE", length = 50, nullable = false, unique = true)
    @Documentation("Type")
    public String Type;

    @Column(name = "NUMBER_PREFIX", length = 20, nullable = false, unique = true)
    @Documentation("Prefix")
    public String Prefix;

    @Column(name = "NUMBER_LENGTH", nullable = true)
    @Documentation("Length")
    public Integer Length;

    @Column(name = "NUMBER_VALUE", nullable = true)
    @Documentation("Value")
    public Integer Value;

}
