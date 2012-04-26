package models;

import java.util.*;

import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;
import com.google.code.morphia.annotations.Id;

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


  public String toString() {
    return name;
  }

  public static List<Line> getSublines(long lineId, long budgetId) {
    return Line.find("parent_line_id,budget_id", lineId, budgetId).asList();
  }

  public static List<Line> getIncomes(long lineId) {
    return Line.find("type", "incomes").asList();
  }

  public static List<Line> getExpenses(long lineId) {
    return Line.find("type", "expenses").asList();
  }

}
