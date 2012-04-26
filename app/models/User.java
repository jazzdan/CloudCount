package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;
import play.libs.Crypto;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Id;

import java.util.*;

/**
 * The user class.
 */
@AutoTimestamp
@Entity
public class User extends Model {
  
  @Id long id;
  public long getNumId() {
    return id;
  }

  @Required
  public String username;

  @Required
  public String last_name;

  @Required
  public String first_name;

  @Email
  @Required
  public String email;

  @Required
  public String password;

  @Required
  public boolean admin;

  public User() {
    this.username = "derp";
    this.last_name = "Derpette";
    this.first_name = "Derpy";
    this.email = "derp@derptastic.com";
    this.password = "herpderp";
    this.admin = false;
  }
  
  /**
   * The user constructor
   *
   * @param username Username of the user
   * @param last_name Last name of the user
   * @param first_name First name of the user
   * @param email Email of the user
   * @param admin True if user is admin, false otherwise.
   */
  public User(String username, String last_name, String first_name, String email, String password, boolean admin) {
    this.username = username;
    this.last_name = last_name;
    this.first_name = first_name;
    this.email = email;
    this.password = Crypto.encryptAES(password);
    this.admin = admin;
  }

  /**
   * Finds a user by email and returns the user for secure class.
   *
   * @param email Email of the user
   * @param password Password of the user TODO: Encrypt/salt
   *
   * @return User that is to be authenticated
   */
  public static User connect(String email, String password) {
    return find("byEmailAndPassword", email, password).first();
  }

  public String toString() {
    return String.valueOf(this.id);
  }

  /**
   * Removes a user from MongoDB
   *
   * @param username Username of the user to be removed/deleted
   *
   * @return Returns true if success, false otherwise
   */
  public static boolean removeUser(String username) {
    User user = User.find("username", username).first();
    try {
      user.delete();
      return true;
    }
    catch(Exception e){
      System.out.println("ERROR: " + e);
      return false;
    }
  }

  public String getPassword() {
    return Crypto.decryptAES(this.password);
  }
}
