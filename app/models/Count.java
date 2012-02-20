package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;

@AutoTimestamp
@Entity
public class Count extends Model {

  @Required
  public String collection;
  
  @Required
  public Integer count;

  public Count(String collection) {
    this.collection = collection;
    this.count = 0;
    this.save();
  }
  
  public static Integer increment(String collection) {
    Count count = Count.find("byCollection", collection).first();
    if(count == null) {
      count = new Count(collection);
    }
    count.count += 1;
    count.save();
    return count.count;
  }
  
  public String toString() {
    return collection + " Count: " + count;
  }

}
