package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

// @With(Secure.class)

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

    public static void create(Budget body) {
      System.out.println(params.get("body"));
      System.out.println(body);

      System.out.println("starts: " + body.starts);
      System.out.println("ends: " + body.ends);

      body.save();
      renderJSON(body);
      //render(something) //we're probably going to want to render some
      //form here.
    }

    /**
     * Update an existing budget.
     */

    public static void update(Budget body) {
      System.out.println("UPDATE!!");
      System.out.println(params.get("body"));
      System.out.println(body.getId());

      Budget b = Budget.find("by_id", body.getId()).first();
      b.title = body.title;
      b.description = body.description;
      b.starts = body.starts;
      b.ends = body.ends;
      b.rolls = body.rolls;

      b.save();
      renderJSON(b);
    }

    /**
     * Delete Budget
     */
    public static void delete(long id) {
        Budget budget = Budget.find("by_id", id).first();
        //TODO: Remove associated attachments and lines.
        budget.delete();
    }

}
