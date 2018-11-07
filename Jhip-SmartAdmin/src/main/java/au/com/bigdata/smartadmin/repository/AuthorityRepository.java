package au.com.bigdata.smartadmin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import au.com.bigdata.smartadmin.domain.Authority;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
