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
     *
     * @param body The JSON params that correspond to the Budget that is
     * to be created.
     */

    public static void create(Budget body) {
      System.out.println(params.get("body"));
      System.out.println(body);

      System.out.println("starts: " + body.starts);
      System.out.println("ends: " + body.ends);

      User user = User.find("byEmail", Security.connected()).first();
      body.save();
      long budgetId = (Long)body.getId();
      body.auditCreate(user.getNumId(), budgetId);
      renderJSON(body);
    }

    /**
     * Update an existing budget.
     *
     * @param body The JSON params that correspond to the Budget that is
     * to be updated.
     */

    public static void update(Budget body) {
      System.out.println("UPDATE!!");
      System.out.println(params.get("body"));
      System.out.println(body.getId());

      Budget b = Budget.find("by_id", body.getId()).first();
      User user = User.find("byEmail", Security.connected()).first();
      long budgetId = (Long)body.getId();
      b.title = body.title;
      b.description = body.description;
      b.starts = body.starts;
      b.ends = body.ends;
      b.rolls = body.rolls;

      b.save();
      body.auditUpdate(user.getNumId(), budgetId);
      renderJSON(b);
    }

    /**
     * Delete Budget
     *
     * @param id The id of the budget that is to be deleted.
     */

    public static void delete(long id) {
        Budget budget = Budget.find("by_id", id).first();
        User user = User.find("byEmail", Security.connected()).first();
        long userId = user.getNumId();
        budget.delete();

        budget.auditDelete(userId, id);
    }

}
