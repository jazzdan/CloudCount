package jobs;

import play.jobs.*;
import models.User;

/**
 * Any methods in the Bootstrap function are run when the application is
 * started which really means when it is first hit with an HTTP Request.
 */

@OnApplicationStart
public class Bootstrap extends Job {

  /**
   * Creates a default user and sets a default password.
   */
  public void doJob() {
    if(User.find("username", "derp").first() == null) {
      User u = new User("derp", "Derpington", "Derpmeister", "derp@derp.com", true);
      u.password = "fr0st3dbUtt5";
      u.save();
    } else {
      System.out.println("Derp already exists in this installation.");
    }
  }
}

