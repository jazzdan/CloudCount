package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

public class Application extends Controller {
    
    @Before
    static void checkAuthentification() {
        if(session.get("user") == null) redirect("/login");
    }
    
    public static void index() {
        render();
    }

}
