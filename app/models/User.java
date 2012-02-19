package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;

@AutoTimestamp
@Entity
public class User extends Model {

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

  public User(String username, String last_name, String first_name, String email, boolean admin) {
    this.username = username;
    this.last_name = last_name;
    this.first_name = first_name;
    this.email = email;
    this.admin = admin;
  }

  public static User connect(String email, String password) {
    return find("byEmailAndPassword", email, password).first();
  }

  public String toString() {
    return username;
  }

}
