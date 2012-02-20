package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

@With(Secure.class)
public class Users extends Controller {

    public static void index() {
      List<Users> users = User.findAll();
      render(users);
    }

}
