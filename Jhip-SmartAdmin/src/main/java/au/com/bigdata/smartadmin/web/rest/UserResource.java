package au.com.bigdata.smartadmin.web.rest;

import com.codahale.metrics.annotation.Timed;

import au.com.bigdata.smartadmin.config.Constants;
import au.com.bigdata.smartadmin.domain.User;
import au.com.bigdata.smartadmin.repository.UserRepository;
import au.com.bigdata.smartadmin.repository.search.UserSearchRepository;
import au.com.bigdata.smartadmin.security.AuthoritiesConstants;
import au.com.bigdata.smartadmin.service.MailService;
import au.com.bigdata.smartadmin.service.UserService;
import au.com.bigdata.smartadmin.web.rest.dto.UserParameter;
import au.com.bigdata.smartadmin.web.rest.dto.UserDTO;
import au.com.bigdata.smartadmin.web.rest.util.HeaderUtil;
import au.com.bigdata.smartadmin.web.rest.util.PaginationUtil;
import au.com.bigdata.smartadmin.web.rest.vm.ManagedUserVM;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import javax.inject.Inject;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing users.
 *
 * <p>This class accesses the User entity, and needs to fetch its collection of authorities.</p>
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority,
 * and send everything to the client side: there would be no View Model and DTO, a lot less code, and an outer-join
 * which would be good for performance.
 * </p>
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </ul>
 * <p>Another option would be to have a specific JPA entity graph to handle this case.</p>
 */
@RestController
@RequestMapping("/api")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);
    
    private static String UPLOAD_DIR = "src/main/webapp/upload";
    
    @Inject
    private UserRepository userRepository;

    @Inject
    private MailService mailService;

    @Inject
    private UserService userService;

    @Inject
    private UserSearchRepository userSearchRepository;

    /**
     * POST : CREATE a new user.
     * Creates a new user if the login and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     *
     * @param managedUserVM the user to create
     * @param request the HTTP request
     * @return the ResponseEntity with status 201 (Created) and with body the new user, or with status 400 (Bad Request) if the login or email is already in use
     * @throws URISyntaxException if the Location URI syntax is incorrect
     * @throws IOException 
     */
    @Timed
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<?> createUser(@ModelAttribute UserParameter managedUserVM, UriComponentsBuilder ucBuilder, 
    		HttpServletRequest request) throws URISyntaxException, IOException {
        log.debug("REST request to save User : {}", managedUserVM);
        
        System.out.println("file size---> "+managedUserVM.getFiles().getSize() ); 
        System.out.println("file name---> "+managedUserVM.getFiles().getOriginalFilename() ); 
        //Lowercase the user login before comparing with database
        if (userRepository.findOneByLogin(managedUserVM.getLogin().toLowerCase()).isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert("userManagement", "userexists", "Login already in use"))
                .body(null);
        } else if (userRepository.findOneByEmailAddress(managedUserVM.getEmailAddress()).isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert("userManagement", "emailexists", "Email already in use"))
                .body(null);
        } else {
            User newUser = userService.createUser(managedUserVM);
            
            String baseUrl = request.getScheme() + // "http"
            "://" +                                // "://"
            request.getServerName() +              // "localhost"
            ":" +                                  // ":"
            request.getServerPort() +              // "8080"
            request.getContextPath();              // "/myContextPath" or "" if deployed in root context
            
            String result = null;
            if(managedUserVM.getFiles().getSize()>0){
            	Long userId = newUser.getId(); 
            	result = this.saveUploadedFiles(managedUserVM.getFiles(), userId);
            	userRepository.updateImageNameById(result, newUser.getId()); 
            }
            
            mailService.sendCreationEmail(newUser, baseUrl);
            
            return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
                .headers(HeaderUtil.createAlert( "userManagement.created", newUser.getLogin()))
                .body(newUser);
        }
    }

    /**
     * UPDATE an existing User.
     *
     * @param managedUserVM the user to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated user,
     * or with status 400 (Bad Request) if the login or email is already in use,
     * or with status 500 (Internal Server Error) if the user couldn't be updated
     */
    @Timed
    @RequestMapping(value = "/users", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<ManagedUserVM> updateUser(@RequestBody ManagedUserVM managedUserVM) {
        log.debug("REST request to update User : {}", managedUserVM);
        
        Optional<User> existingUser = userRepository.findOneByEmailAddress(managedUserVM.getEmailAddress());
        
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(managedUserVM.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("userManagement", "emailexists", "E-mail already in use")).body(null);
        }
        existingUser = userRepository.findOneByLogin(managedUserVM.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(managedUserVM.getId()))) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("userManagement", "userexists", "Login already in use")).body(null);
        }
        
        //delete existing image 
      	deleteUserImage(String.valueOf(managedUserVM.getId()));       	      

        //Upload New Image 
  		try {
  			this.saveUploadedFiles(managedUserVM.getFiles(), managedUserVM.getId());  			
  		} catch (IOException e) {
              e.printStackTrace();
        }
        
        userService.updateUser(managedUserVM.getId(), managedUserVM.getLogin(), managedUserVM.getFirstName(),
            managedUserVM.getLastName(), managedUserVM.getEmailAddress(), managedUserVM.isActivated(),
            managedUserVM.getLangKey(), managedUserVM.getAuthorities(), String.valueOf(managedUserVM.getId()));
        
        return ResponseEntity.ok()
            .headers(HeaderUtil.createAlert("userManagement.updated", managedUserVM.getLogin()))
            .body(new ManagedUserVM(userService.getUserWithAuthorities(managedUserVM.getId())));
    }

    /**
     * GET  /users : get all users.
     * 
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and with body all users
     * @throws URISyntaxException if the pagination headers couldn't be generated
     */
    @Timed
    @RequestMapping(value = "/users", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ManagedUserVM>> getAllUsers(Pageable pageable)
        throws URISyntaxException {
        Page<User> page = userRepository.findAllWithAuthorities(pageable);
        List<ManagedUserVM> managedUserVMs = page.getContent().stream()
            .map(ManagedUserVM::new)
            .collect(Collectors.toList());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
        return new ResponseEntity<>(managedUserVMs, headers, HttpStatus.OK);
    }

    /**
     * GET  /users/:loginId : get the "loginId" user.
     *
     * @param login the loginId of the user to find
     * @return the ResponseEntity with status 200 (OK) and with body the "loginId" user, or with status 404 (Not Found)
     */
    @Timed
    @RequestMapping(value = "/loginUser/{login}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ManagedUserVM> getUser(@PathVariable String login) {
        
        Optional<User> user = null; 
        user = userRepository.findOneById(Long.parseLong(login)); 
        log.debug("REST request to get User : {}", user.get().getLogin());

        return userService.getUserWithAuthoritiesByLogin(user.get().getLogin())
                .map(ManagedUserVM::new)
                .map(managedUserVM -> new ResponseEntity<>(managedUserVM, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE User by Id.
     *
     * @param login the login of the user to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @Timed
    @RequestMapping(value = "/users/{login}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
    	 log.debug("REST request to delete User: {}", login);    	
         Optional<User> user = null; 
         user = userRepository.findOneByLogin(login); 
         if(user != null){
         	 deleteUserImage(String.valueOf(user.get().getId())); 

             userService.deleteUser(login);
         }
                         
         return ResponseEntity.ok().headers(HeaderUtil.createAlert( "userManagement.deleted", login)).build();
     }

    
    /**
     * SEARCH  /_search/users/:query : search for the User corresponding
     * to the query.
     *
     * @param query the query to search
     * @return the result of the search
     */
    @Timed
    @RequestMapping(value = "/_search/users/{query}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<User> search(@PathVariable String query) {
        return StreamSupport
            .stream(userSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
    
    
    /**	Save Image Files	*/
    private String saveUploadedFiles(MultipartFile file, Long userId) throws IOException {
        // Make sure directory exists!
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
 
        String uploadFilePath = UPLOAD_DIR +"/"+ userId +".png";
        
        byte[] bytes = file.getBytes();
        Path path = Paths.get(uploadFilePath);
        Files.write(path, bytes);
    
        return userId +".png";
    }
    
    /**	 Download image file 	*/ 
    @GetMapping("/rest/files/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws MalformedURLException {
        File file = new File(UPLOAD_DIR +"/"+ filename);
        if (!file.exists()) {
            throw new RuntimeException("File not found");
        }
        Resource resource = new UrlResource(file.toURI());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
    
	/** 	Delete the image    */
    public void deleteUserImage(String id){
	   	String filePath = UPLOAD_DIR +"/"+ id +".png";
	   	File file = new File(filePath);
	   	
	   	if (file.exists()) {
	   		try{ 
		   		 Files.deleteIfExists(Paths.get(filePath)); 
		   	 } catch(NoSuchFileException e) { 
		   		 System.out.println("No such file/directory exists"); 
		   	 } catch(DirectoryNotEmptyException e) { 
		   		 System.out.println("Directory is not empty."); 
		   	 } catch(IOException e) { 
		   		 System.out.println("Invalid permissions."); 
		   	 } 
	   	}
	   	 
	}
    
    
}
