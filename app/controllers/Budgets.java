package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

@With(Secure.class)
public class Budgets extends Controller {

    public static void index() {
      List<Budget> budgets = Budget.findAll();
      renderJSON(budgets);
    }

}
