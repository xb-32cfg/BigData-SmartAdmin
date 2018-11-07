package au.com.bigdata.smartadmin.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import au.com.bigdata.smartadmin.domain.Label;

/**
 * Spring Data ElasticSearch repository for the Label entity.
 */
public interface LabelSearchRepository extends ElasticsearchRepository<Label, Long> {
}
