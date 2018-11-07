package au.com.bigdata.smartadmin.repository;

import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;

import au.com.bigdata.smartadmin.domain.PersistentToken;
import au.com.bigdata.smartadmin.domain.User;

import java.util.List;

/**
 * Spring Data JPA repository for the PersistentToken entity.
 */
public interface PersistentTokenRepository extends JpaRepository<PersistentToken, String> {

    List<PersistentToken> findByUser(User user);

    List<PersistentToken> findByTokenDateBefore(LocalDate localDate);

}
