package au.com.bigdata.smartadmin.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import au.com.bigdata.smartadmin.domain.User;

/**
 * Spring Data ElasticSearch repository for the User entity.
 */
public interface UserSearchRepository extends ElasticsearchRepository<User, Long> {
}
