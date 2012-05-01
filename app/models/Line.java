package models;

import java.util.*;

import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;
import com.google.code.morphia.annotations.Id;


/**
 * The Line model
 */
@AutoTimestamp
@Entity
public class Line extends Model {

  // @Id long id;
  // public long getNumId() {
    // return id;
  // }

  @Required
  public long budgetId;

  public String user;

  @Required
  public int line_number;

  @Required
  public String name;

  @Required
  public double subtotal;

  public long parent_line_id;

  @Required
  public String type;

  @Required
  public int order;

  /**
   * Line object constructor
   *
   * @param budgetId the budgetId that the line will belong to
   * @param user The user that created the budget
   * @param lineNumber The line number of the line
   * @param name The name of the line
   * @param subtotal The current total of the line and all its sublines
   * @param parent_line_id The id of the parent line. If null then this
   * is not a subline
   * @param type Whether the line is an expense or income line
   * @param order An arbitrary order integer used for sorting
   */

  public Line(long budgetId, String user, int lineNumber, String name, double subtotal, long parent_line_id, String type, int order) {
    // this.id = id;
    this.budgetId = budgetId;
    this.user = user;
    this.line_number = lineNumber;
    this.name = name;
    this.subtotal = subtotal;
    this.parent_line_id = parent_line_id;
    this.type = type;
    this.order = order;
  }

  /**
   * Retursn the name of the line
   */
  public String toString() {
    return name;
  }

  /**
   * Returns all sublines (if any) associated with a line.
   * @param lineId The id of the line we want to get all of the sublines
   * of
   */
  public static List<Line> getSublines(long lineId) {
    return Line.find("parent_line_id", lineId).asList();
  }

  /**
   * Returns all income lines associated with a budget.
   * @param budgetId The id of the budget we want to get all the income
   * lines from.
   */
  public static List<Line> getIncomes(long budgetId) {
    return Line.find("type,budgetId", "incomes", budgetId).asList();
  }

  /**
   * Returns all expense lines associated with a budget.
   * @param budgetId The id of the budget we want to get all the expense
   * lines from.
   */

  public static List<Line> getExpenses(long budgetId) {
    return Line.find("type,budgetId", "expenses", budgetId).asList();
  }

}
