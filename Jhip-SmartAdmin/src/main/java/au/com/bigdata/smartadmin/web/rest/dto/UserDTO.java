package au.com.bigdata.smartadmin.web.rest.dto;

import org.hibernate.validator.constraints.Email;
import org.springframework.web.multipart.MultipartFile;

import au.com.bigdata.smartadmin.config.Constants;
import au.com.bigdata.smartadmin.domain.Authority;
import au.com.bigdata.smartadmin.domain.User;

import javax.persistence.Column;
import javax.validation.constraints.*;
import java.util.Set;
import java.util.stream.Collectors;
/**
 * A DTO representing a user, with his authorities.
 */
public class UserDTO {

	public static final int PASSWORD_MIN_LENGTH = 5;
    public static final int PASSWORD_MAX_LENGTH = 100;
    
    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    private String login;

    @NotNull
    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;
    
    @Size(max = 50)
    private String firstName;

    @Size(max = 30)
    private String middleName;   
    
    @Size(max = 50)
    private String lastName;
    
    @Email
    @Size(min = 5, max = 100)
    private String emailAddress;

    @Size(max = 50)
	private String imageName;
    
    private boolean activated = false;

    @Size(min = 2, max = 5)
    private String langKey;

    private Set<String> authorities;

    private MultipartFile files;
    
    public UserDTO() {
    }

    public UserDTO(User user) {
        this(user.getLogin(), null, user.getFirstName(), user.getMiddleName(), user.getLastName(), 
            user.getEmailAddress(), user.getImageName(), user.getFiles(), user.getActivated(), user.getLangKey(),
            user.getAuthorities().stream().map(Authority::getName)
                .collect(Collectors.toSet()));
    }

    public UserDTO(String login, String password, String firstName, String middleName, String lastName,
        String emailAddress, String imageName, MultipartFile files, boolean activated, String langKey, Set<String> authorities) {

        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.imageName = imageName;
        this.files = files; 
        this.activated = activated;
        this.langKey = langKey;
        this.authorities = authorities;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }
    
    public String getFirstName() {
        return firstName;
    }

    public String getMiddleName() {
        return middleName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public String getImageName() {
        return imageName;
    }
    
    public String getEmailAddress() {
        return emailAddress;
    }

    public boolean isActivated() {
        return activated;
    }

    public String getLangKey() {
        return langKey;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public MultipartFile getFiles() {
		return files;
	}
    
    @Override
    public String toString() {
        return "UserDTO{" +
            "login='" + login + '\'' +
            ", password='" + password + '\'' +
            ", firstName='" + firstName + '\'' +
            ", middleName='" + middleName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", emailAddress='" + emailAddress + '\'' +
            ", imageName='" + imageName + '\'' +
            ", files='" + files + '\'' +
            ", activated=" + activated +
            ", langKey='" + langKey + '\'' +
            ", authorities=" + authorities +
            "}";
    }
}
