package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;

@AutoTimestamp
@Entity
public class Attachment extends AutoIncrement {

  // @Required
  // public int id;

  @Required
  public String label;

  @Required
  public String description;

  @Required
  @Reference
  public User uploaded_by;

  @Required
  @Reference
  public Budget budget;

  @Required
  public int jr_node;

  public Attachment(String label, String descrption, User uploaded_by, Budget budget, int jr_node) {
    super();
    this.label = label;
    this.description = description;
    this.uploaded_by = uploaded_by;
    this.budget = budget;
    this.jr_node = jr_node;
  }


  public String toString() {
    return label;
  }

}
