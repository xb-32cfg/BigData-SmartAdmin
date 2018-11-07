package au.com.bigdata.smartadmin.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import au.com.bigdata.smartadmin.domain.BankAccount;
import au.com.bigdata.smartadmin.repository.BankAccountRepository;
import au.com.bigdata.smartadmin.repository.search.BankAccountSearchRepository;
import au.com.bigdata.smartadmin.security.SecurityUtils;
import au.com.bigdata.smartadmin.web.rest.util.HeaderUtil;
import au.com.bigdata.smartadmin.web.rest.util.PaginationUtil;

/**
 * REST controller for managing BankAccount.
 */
@RestController
@RequestMapping("/api")
public class BankAccountResource {

	private final Logger log = LoggerFactory.getLogger(BankAccountResource.class);

	@Inject
	private BankAccountRepository bankAccountRepository;

	@Inject
	private BankAccountSearchRepository bankAccountSearchRepository;

	/**
	 * POST /bankAccounts -> Create a new bankAccount.
	 */
	@RequestMapping(value = "/bankAccounts", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<BankAccount> createBankAccount(@RequestBody BankAccount bankAccount)
			throws URISyntaxException {
		log.debug("REST request to save BankAccount : {}", bankAccount);
		if (bankAccount.getId() != null) {
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("bankAccount", "idexists",
					"A new bankAccount cannot already have an ID")).body(null);
		}
		BankAccount result = bankAccountRepository.save(bankAccount);
		bankAccountSearchRepository.save(result);
		return ResponseEntity.created(new URI("/api/bankAccounts/" + result.getId()))
				.headers(HeaderUtil.createEntityCreationAlert("bankAccount", result.getId().toString())).body(result);
	}

	/**
	 * PUT /bankAccounts -> Updates an existing bankAccount.
	 */
	@RequestMapping(value = "/bankAccounts", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<BankAccount> updateBankAccount(@RequestBody BankAccount bankAccount)
			throws URISyntaxException {
		log.debug("REST request to update BankAccount : {}", bankAccount);
		if (bankAccount.getId() == null) {
			return createBankAccount(bankAccount);
		}
		BankAccount result = bankAccountRepository.save(bankAccount);
		bankAccountSearchRepository.save(result);
		return ResponseEntity.ok()
				.headers(HeaderUtil.createEntityUpdateAlert("bankAccount", bankAccount.getId().toString()))
				.body(result);
	}

	/**
	 * GET /bankAccounts -> get all the bankAccounts.
	 */
	@RequestMapping(value = "/bankAccounts", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<List<BankAccount>> getAllBankAccounts(Pageable pageable) throws URISyntaxException {
		log.debug("REST request to get a page of BankAccounts");
		Page<BankAccount> page = bankAccountRepository.findAll(pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/bankAccounts");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * GET /bankAccounts -> get all the bankAccounts.
	 */
	@RequestMapping(value = "/userBankAccounts", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<List<BankAccount>> getAllUserBankAccounts(Pageable pageable) throws URISyntaxException {
		log.debug("REST request to get a page of BankAccounts");
		Page<BankAccount> page = bankAccountRepository.findByUserLogin(SecurityUtils.getCurrentUserLogin(), pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/bankAccounts");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}

	/**
	 * GET /bankAccounts/:id -> get the "id" bankAccount.
	 */
	@RequestMapping(value = "/bankAccounts/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<BankAccount> getBankAccount(@PathVariable Long id) {
		log.debug("REST request to get BankAccount : {}", id);
		BankAccount bankAccount = bankAccountRepository.findOne(id);
		return Optional.ofNullable(bankAccount).map(result -> new ResponseEntity<>(result, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	/**
	 * DELETE /bankAccounts/:id -> delete the "id" bankAccount.
	 */
	@RequestMapping(value = "/bankAccounts/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<Void> deleteBankAccount(@PathVariable Long id) {
		log.debug("REST request to delete BankAccount : {}", id);
		bankAccountRepository.delete(id);
		bankAccountSearchRepository.delete(id);
		return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("bankAccount", id.toString())).build();
	}

	/**
	 * SEARCH /_search/bankAccounts/:query -> search for the bankAccount
	 * corresponding to the query.
	 */
	@RequestMapping(value = "/_search/bankAccounts/{query:.+}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<BankAccount> searchBankAccounts(@PathVariable String query) {
		log.debug("REST request to search BankAccounts for query {}", query);
		return StreamSupport.stream(bankAccountSearchRepository.search(queryStringQuery(query)).spliterator(), false)
				.collect(Collectors.toList());
	}
}
