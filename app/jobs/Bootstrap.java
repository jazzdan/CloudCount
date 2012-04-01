package jobs;

import play.jobs.*;
import models.User;

@OnApplicationStart
public class Bootstrap extends Job {
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

