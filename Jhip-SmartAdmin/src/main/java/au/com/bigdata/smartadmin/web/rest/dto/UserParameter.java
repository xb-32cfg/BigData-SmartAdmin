package au.com.bigdata.smartadmin.web.rest.dto;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.joda.time.DateTime;
import org.springframework.web.multipart.MultipartFile;
import au.com.bigdata.smartadmin.domain.Authority;

/**
* @author   : Mohammad Nuruzzaman
* @email    : dr.zaman1981@gmail.com
* @version  : v1.0, Date: Sep 19, 2018 3:17:25 PM
*/

public class UserParameter {

	private Long id;

    private String login;

    private String firstName;
    
    private String middleName;
    
    private String lastName;

    private String nationalId;
    
    private String emailAddress;
    
    private String password;
    
    private String phone;
    
    private boolean activated = false;	//account status

    private Date passwordExpDate;
    
    private int maxLogin;
    
    private int maxFailAttemptsAllow;
    
    private Date accActivationDate;    

    private String langKey;

    private String activationKey;

    private String resetKey;

    private Date resetDate = null;

    private Set<Authority> authorities = new HashSet<>();

	private MultipartFile files;

	private String comments;
    
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String email) {
		this.emailAddress = email;
	}

	public boolean isActivated() {
		return activated;
	}

	public void setActivated(boolean activated) {
		this.activated = activated;
	}

	public String getLangKey() {
		return langKey;
	}

	public void setLangKey(String langKey) {
		this.langKey = langKey;
	}

	public String getActivationKey() {
		return activationKey;
	}

	public void setActivationKey(String activationKey) {
		this.activationKey = activationKey;
	}

	public String getResetKey() {
		return resetKey;
	}

	public void setResetKey(String resetKey) {
		this.resetKey = resetKey;
	}

	public Date getResetDate() {
		return resetDate;
	}

	public void setResetDate(Date resetDate) {
		this.resetDate = resetDate;
	}

	public Set<Authority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Set<Authority> authorities) {
		this.authorities = authorities;
	}

	public MultipartFile getFiles() {
		return files;
	}

	public void setFiles(MultipartFile files) {
		this.files = files;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getNationalId() {
		return nationalId;
	}

	public void setNationalId(String nationalId) {
		this.nationalId = nationalId;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Date getPasswordExpDate() {
		return passwordExpDate;
	}

	public void setPasswordExpDate(Date passwordExpDate) {
		this.passwordExpDate = passwordExpDate;
	}

	public int getMaxLogin() {
		return maxLogin;
	}

	public void setMaxLogin(int maxLogin) {
		this.maxLogin = maxLogin;
	}

	public int getMaxFailAttemptsAllow() {
		return maxFailAttemptsAllow;
	}

	public void setMaxFailAttemptsAllow(int maxFailAttemptsAllow) {
		this.maxFailAttemptsAllow = maxFailAttemptsAllow;
	}

	public Date getAccActivationDate() {
		return accActivationDate;
	}

	public void setAccActivationDate(Date accActivationDate) {
		this.accActivationDate = accActivationDate;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	
}
