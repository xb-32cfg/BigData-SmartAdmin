package au.com.bigdata.smartadmin.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import au.com.bigdata.smartadmin.domain.Operation;

/**
 * Spring Data ElasticSearch repository for the Operation entity.
 */
public interface OperationSearchRepository extends ElasticsearchRepository<Operation, Long> {
}
