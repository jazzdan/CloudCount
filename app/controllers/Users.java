package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

/**
 * The user class handles users and their metadata.
 */
@With(Secure.class)
public class Users extends Controller {

    /**
     * Lists all users in the database and renders the data to the view.
     */
    public static void index() {
      List<Users> users = User.findAll();
      render(users);
    }

}
