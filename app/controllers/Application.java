package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

import java.io.File;

@With(Secure.class)
public class Application extends Controller {

    public static void index() {
        render();
    }

}
