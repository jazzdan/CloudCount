package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

@With(Secure.class)
public class Application extends Controller {

    public static void index() {
        User user = User.find("byEmail", Security.connected()).first();
        render(user);
    }

}
