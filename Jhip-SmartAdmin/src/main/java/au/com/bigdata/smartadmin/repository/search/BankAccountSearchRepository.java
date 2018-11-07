package au.com.bigdata.smartadmin.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import au.com.bigdata.smartadmin.domain.BankAccount;

/**
 * Spring Data ElasticSearch repository for the BankAccount entity.
 */
public interface BankAccountSearchRepository extends ElasticsearchRepository<BankAccount, Long> {
}
