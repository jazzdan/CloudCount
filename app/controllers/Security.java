package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

/**
 * Security class that handles authenticating users and permissions.
 */

public class Security extends Secure.Security {
    
    /**
     * Authenticates User
     * @param email Email of the user
     * @param password Users password TODO: Encrypt/salt this
     *
     * @return True if authentication succeeded, false otherwise.
     */
    static boolean authenticate(String email, String password) {
        User user = User.find("byEmail", email).first();
        Boolean authed = user != null && user.getPassword().equals(password);
        return authed;
    }

    /**
     * Is Admin
     * @param profile
     *
     * @return true if user is admin, false otherwise.
     */
    static boolean isAdmin(String profile) {
        User user = User.find("byEmail", connected()).first();
        return user.admin;
    }
}
