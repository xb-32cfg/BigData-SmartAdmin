package au.com.bigdata.smartadmin.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.inject.Inject;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import au.com.bigdata.smartadmin.domain.Operation;
import au.com.bigdata.smartadmin.repository.OperationRepository;
import au.com.bigdata.smartadmin.repository.search.OperationSearchRepository;
import au.com.bigdata.smartadmin.security.SecurityUtils;
import au.com.bigdata.smartadmin.service.BalanceService;
import au.com.bigdata.smartadmin.web.rest.util.HeaderUtil;
import au.com.bigdata.smartadmin.web.rest.util.PaginationUtil;

/**
 * REST controller for managing Operation.
 */
@RestController
@RequestMapping("/api")
public class OperationResource {

    private final Logger log = LoggerFactory.getLogger(OperationResource.class);
        
    @Inject
    private OperationRepository operationRepository;
    
    @Inject
    private OperationSearchRepository operationSearchRepository;
    
    @Autowired
    private BalanceService balanceService;
    
    /**
     * POST  /operations -> Create a new operation.
     */
    @RequestMapping(value = "/operations",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Operation> createOperation(@Valid @RequestBody Operation operation) throws URISyntaxException {
        log.debug("REST request to save Operation : {}", operation);
        if (operation.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("operation", "idexists", "A new operation cannot already have an ID")).body(null);
        }
//        Operation result = operationRepository.save(operation);
        Operation result = balanceService.add(operation);
        operationSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/operations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("operation", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /operations -> Updates an existing operation.
     */
    @RequestMapping(value = "/operations",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Operation> updateOperation(@Valid @RequestBody Operation operation) throws URISyntaxException {
        log.debug("REST request to update Operation : {}", operation);
        if (operation.getId() == null) {
            return createOperation(operation);
        }
        Operation result = operationRepository.save(operation);
        operationSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("operation", operation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /operations -> get all the operations.
     */
    @RequestMapping(value = "/operations",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
//    public ResponseEntity<List<Operation>> getAllOperations(Pageable pageable)
//        throws URISyntaxException {
//        log.debug("REST request to get a page of Operations");
//        Page<Operation> page = operationRepository.findAll(pageable); 
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/operations");
//        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
//    }
    public ResponseEntity<List<Operation>> getAllOperations(Pageable pageable)
            throws URISyntaxException {
            log.debug("REST request to get a page of Operations");
            Page<Operation> page = operationRepository.findByBankAccountUserLoginOrderByDateAsc (SecurityUtils.getCurrentUserLogin(), pageable); 
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/operations");
            return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
        }

    /**
     * GET  /operations/:id -> get the "id" operation.
     */
    @RequestMapping(value = "/operations/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Operation> getOperation(@PathVariable Long id) {
        log.debug("REST request to get Operation : {}", id);
        Operation operation = operationRepository.findOneWithEagerRelationships(id);
        return Optional.ofNullable(operation)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /operations/:id -> delete the "id" operation.
     */
    @RequestMapping(value = "/operations/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteOperation(@PathVariable Long id) {
        log.debug("REST request to delete Operation : {}", id);
        operationRepository.delete(id);
        operationSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("operation", id.toString())).build();
    }

    /**
     * SEARCH  /_search/operations/:query -> search for the operation corresponding
     * to the query.
     */
    @RequestMapping(value = "/_search/operations/{query:.+}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Operation> searchOperations(@PathVariable String query) {
        log.debug("REST request to search Operations for query {}", query);
        return StreamSupport
            .stream(operationSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
