package gen.codbex_number_generator.data.settings;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

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
