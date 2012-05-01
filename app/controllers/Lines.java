package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

// @With(Secure.class)

/**
Lines controller
*/
public class Lines extends Controller {

    /**
     * Takes a budget id and renders an HTML list of all of the lines
     * associated with that budget.
     *
     * @param budgetId The id of the budget.
     */

	public static void index(long budgetId) {
		List<Line> lines = Line.find("budgetId", budgetId).asList();
		renderJSON(lines);
	}

    /**
     * Takes a line id and returns a JSON representation of that line.
     *
     * @param id The id of the line to be rendered and returned.
     */

	public static void line(long id) {
		Line line = Line.find("by_id", id).first();
		renderJSON(line);
	}

    /**
     * Takes a budget, and the JSON representation of a Line and creates
     * the Line and saves it to that budget.
     *
     * @param budgetId The Budget that the line is to be associated
     * with.
     * @param body The JSON representation of the line that is to be
     * created.
     */

	public static void create(long budgetId, Line body) {
		// find the user
    	User user = User.find("byEmail", Security.connected()).first();
    	body.budgetId = budgetId;
		body.save();
		renderJSON(body);
	}

    /**
     * Updates the line specified with the attributes that are passed
     * in.
     *
     * @param body The JSON representation of the line that is to be
     * updated.
     */

	public static void update(Line body) {
		Line l = Line.find("by_id", body.getId()).first();
			// find the user
	    User user = User.find("byEmail", Security.connected()).first();

			l.user = user.toString();
			l.line_number = body.line_number;
			l.name = body.name;
			l.subtotal = body.subtotal;
			l.parent_line_id = body.parent_line_id;
			l.order = body.order;

			l.save();
			renderJSON(l);
	}


    /**
     * Deletes the line specified.
     *
     * @param lineId The line that is to be deleted.
     */

	public static void delete(long lineId) {
		Line l = Line.find("by_id", lineId).first();
		l.delete();
	}

    /**
     * Returns all of the sublines associated with a line,
     * @param lineId the Id of the line that we want all of the sublines
     * of.
     */

	public static void sublines(long lineId) {
		List<Line> sublines = Line.getSublines(lineId);
		renderJSON(sublines);
	}

    /**
     * Returns all of the expense lines associated with a budget,
     * @param budgetId The id of the budget that we want to get all
     * of the associated expense lines from.
     */

	public static void expenses(long budgetId) {
		List<Line> expenses = Line.getExpenses(budgetId);
		renderJSON(expenses);
	}
    
    /**
     * Returns all the income lines associated with a budget.
     * @param budgetId The id of the budget that we want to get all of
     * the associated expense lines from.
     */
	public static void incomes(long budgetId) {
		List<Line> incomes = Line.getIncomes(budgetId);
		renderJSON(incomes);
	}

}
