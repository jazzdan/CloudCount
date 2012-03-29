package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

@With(Secure.class)

/**
 * Budgets controller
 */
public class Budgets extends Controller {

    /**
     * Constructs a list of all budgets and renders it to the view in
     * JSON format.
     */
    public static void index() {
      List<Budget> budgets = Budget.findAll();
      renderJSON(budgets);
    }

    /**
     * Returns JSON for given budget by IdentifierHelper
     */
    public static void budget(long id) {
      Budget budget = Budget.find("by_id", id).first();
      renderJSON(budget);
    }

    /**
     * Create Budget
     */

    public static void create(String title, String description, int start, int ends, String rolls) {
      Budget b = new Budget(title, description, start, ends, rolls);
      b.save();
      //render(something) //we're probably going to want to render some
      //form here.
    }

    /**
     * Delete Budget
     */
    public static void delete(long id) {
        Budget budget = Budget.find("by_id", id).first();
        budget.delete();
    }

}
