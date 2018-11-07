package au.com.bigdata.smartadmin.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import au.com.bigdata.smartadmin.domain.BankAccount;
import au.com.bigdata.smartadmin.domain.Operation;
import au.com.bigdata.smartadmin.repository.BankAccountRepository;
import au.com.bigdata.smartadmin.repository.OperationRepository;

@Service
@Transactional
public class BalanceService {

    private final Logger log = LoggerFactory.getLogger(BalanceService.class);

    @Autowired
    private OperationRepository operationRepository;
    
    @Autowired
    private BankAccountRepository bankAccountRepository;
    
	public Operation add(Operation operation) {
		// TODO Auto-generated method stub		
		Operation result = operationRepository.save(operation);
		BankAccount bankAccount = bankAccountRepository.findOne(result.getBankAccount().getId());
		bankAccount.setBalance(bankAccount.getBalance().add(result.getAmount()));
		return result;
	}

}
