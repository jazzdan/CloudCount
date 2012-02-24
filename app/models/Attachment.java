package models;

//Default play stuff 
import play.data.validation.Email;
import play.data.validation.Required;

//Morphia stuff
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;
import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;

// @JcrNode(mixinTypes = { "mix:created", "mix:lastModified", "mix:referenceable" })
@AutoTimestamp
@Entity
public class Attachment extends Model {

  private long budgetId;
  private long nodeId;
  private long userId;

  // @Required
  // public int id;

  @Required
  public String label;

  @Required
  public String description;

  // @Required
  // @Reference
  // public User uploaded_by;

  // @Required
  // @Reference
  // public Budget budget;

  // @Required
  // public Node node;

  public Attachment(String label, String descrption/*, User uploaded_by, Budget budget, Node node*/) {
    this.label = label;
    this.description = description;
    /*this.uploaded_by = uploaded_by;
    this.budget = budget;
    this.node = node;*/
  }

  public Budget getBudget() {
    return Budget.findById(budgetId);
    // return null == budget ? null : Budget.findById(budget); //TODO: Figure out why this isn't working
  }

  public Node getNode() {
    return Node.findById(nodeId);
  }

  public User getUser() {
    return User.findById(userId);
  }

  public void setBudget(long budgetId) {
    this.budgetId = budgetId;
  }

  public void setNode(long budgetId) {
    this.budgetId = budgetId;
  }


  public String toString() {
    return label;
  }

}
