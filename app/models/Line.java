package models;

import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;

@AutoTimestamp
@Entity
public class Line extends Model {

  // @Required
  // public int id;

  @Required
  public int budgetId;

  public String user;

  @Required
  public int line_number;

  @Required
  public String name;

  @Required
  public double subtotal;

  public int parent_line_id;

  @Required
  public int order;

  public Line(int budgetId, String user, int lineNumber, String name, double subtotal, int parent_line_id, int order) {
    // this.id = id;
    this.budgetId = budgetId;
    this.user = user;
    this.line_number = lineNumber;
    this.name = name;
    this.subtotal = subtotal;
    this.parent_line_id = parent_line_id;
    this.order = order;
  }


  public String toString() {
    return name;
  }

}
