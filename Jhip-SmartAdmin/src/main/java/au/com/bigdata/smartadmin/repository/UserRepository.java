package au.com.bigdata.smartadmin.repository;

import java.time.ZonedDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import au.com.bigdata.smartadmin.domain.User;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndCreatedDateBefore(ZonedDateTime dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByLogin(String login);

    Optional<User> findOneById(Long userId);

    @Query(value = "select distinct user from User user join fetch user.authorities",
        countQuery = "select count(user) from User user")
    Page<User> findAllWithAuthorities(Pageable pageable);

    @Override
    void delete(User t);
    
    @Transactional
	@Modifying
	@Query("update User set imageName = ?1 where id = ?2")
	int saveImageUserById(String imgName, Long id);
    

}
