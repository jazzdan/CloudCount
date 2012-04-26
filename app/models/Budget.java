package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Indexed;

import models.Audit;

/**
 * The budget class
 */

@AutoTimestamp
@Entity
public class Budget extends Model {

  @Required
  @Indexed
  public String title;

  @Required
  public String description;

  @Required
  public long starts;

  @Required
  public long ends;

  @Required
  public String rolls;

  /**
   * Creates a budget object.
   *
   * @param title The title of the budget
   * @param description The description of the budget
   * @param starts The start date of the budget
   * @param ends The end date of the budget
   * @param rolls The roll of the budget
   */
  public Budget(String title, String description, long starts, long ends, String rolls) {
    this.title = title;
    this.description = description;
    this.starts = starts;
    this.ends = ends;
    this.rolls = rolls;
  }


  public String toString() {
    return title;
  }

  public void auditCreate(long userId, long budgetId) {
    System.out.println("Ding from" + budgetId + "!");
    Audit a = new Audit(userId, budgetId, "Budget", "create");
    a.save();    
  }

  public void auditUpdate(long userId, long budgetId) {
    Audit a = new Audit(userId, budgetId, "Budget", "update");
    a.save();
  }

  public void auditDelete(long userId, long budgetId) {
    Audit a = new Audit(userId, budgetId, "Budget", "update");
    a.save();
  }

}
