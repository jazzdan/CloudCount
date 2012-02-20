package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;

@AutoTimestamp
@Entity
public abstract class AutoIncrement extends Model {

  @Required
  public int iid;

  public AutoIncrement() {
    Integer count = Count.increment(name());
    this.iid = count;
  }

  public String toString() {
    return name();
  }
  
  protected String name() {
    return getClass().getName();
  }

}
