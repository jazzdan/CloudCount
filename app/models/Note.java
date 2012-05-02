package models;

import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Indexed;

/**
 * The note class
 */

@AutoTimestamp
@Entity
public class Note extends Model {

  @Required
  @Indexed
  public String title;

  @Required
  public String contents;

  @Required
  public long budgetId;

  public Note(String title, String contents, long budgetId){
    this.title = title;
    this.contents = contents;
    this.budgetId = budgetId;
  }

  public String toString() {
    return title;
  }

}
