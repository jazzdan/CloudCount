package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

import java.io.File;

/**
 * The application controller has but one method where it finds the
 * currently connected user and renders that users view in the browser.
 * All other application logic is handled by JavaScript
 */
@With(Secure.class)
public class Application extends Controller {

    public static void index() {
        User user = User.find("byEmail", Security.connected()).first();
        render(user);
    }

}
