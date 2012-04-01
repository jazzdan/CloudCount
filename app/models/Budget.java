package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Indexed;

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
  public int starts;

  @Required
  public int ends;

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
  public Budget(String title, String description, int starts, int ends, String rolls) {
    this.title = title;
    this.description = description;
    this.starts = starts;
    this.ends = ends;
    this.rolls = rolls;
  }


  public String toString() {
    return title;
  }

}
