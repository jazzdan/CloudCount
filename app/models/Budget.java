package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;

/**
 * The budget class
 */
@AutoTimestamp
@Entity
public class Budget extends Model {

  // @Required
  // public int id;

  @Required
  public String title;

  @Required
  public String description;

  @Required
  public int start;

  @Required
  public int ends;

  @Required
  public String rolls;

  /**
   * Creates a budget object.
   *
   * @param title The title of the budget
   * @param description The description of the budget
   * @param start The start date of the budget
   * @param ends The end date of the budget
   * @param rolls The roll of the budget
   */
  public Budget(String title, String description, int start, int ends, String rolls) {
    // this.id = id;
    this.title = title;
    this.description = description;
    this.start = start;
    this.ends = ends;
    this.rolls = rolls;
  }


  public String toString() {
    return title;
  }

}
