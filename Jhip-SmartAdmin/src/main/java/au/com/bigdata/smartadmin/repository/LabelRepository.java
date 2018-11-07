package au.com.bigdata.smartadmin.repository;

import org.springframework.data.jpa.repository.*;

import au.com.bigdata.smartadmin.domain.Label;

import java.util.List;

/**
 * Spring Data JPA repository for the Label entity.
 */
public interface LabelRepository extends JpaRepository<Label,Long> {

}
