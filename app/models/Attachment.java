package models;

//Default play stuff 
import play.data.validation.Email;
import play.data.validation.Required;

//Morphia stuff
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;
import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;

//Jackrabbit stuff
import org.jcrom.JcrFile;
import org.jcrom.JcrMappingException;

import java.io.File;
import play.libs.MimeTypes;

@AutoTimestamp
@Entity
public class Attachment extends Model {

  private long budgetId;
  public String nodeId;
  private long userId;

  // @Required
  // public int id;

  @Required
  public String label;

  @Required
  public String description;

  public File attachment;

  // @Required
  // @Reference
  // public User uploaded_by;

  // @Required
  // @Reference
  // public Budget budget;

  @Required
  public Node node;

  public Attachment(String label, String description, long userId, long budgetId, File attachment) {
    this.label = label;
    this.description = description;
    this.userId = userId;
    this.budgetId = budgetId;
    this.attachment = attachment;
    //TODO: Create a node with the attachment in it and store that node id
    this.nodeId = createNode(attachment);
  }

  // public Attachment(String label, String descrption[>, User uploaded_by, Budget budget, Node node<]) {
    // this.label = label;
    // this.description = description;
    // this.uploaded_by = uploaded_by;
    // this.budget = budget;
    // this.node = node;*/
  // }

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

  public void setUser(long userId) {
    this.userId = userId;
  }

  public void setNode(long budgetId) {
    this.budgetId = budgetId;
  }

  public JcrFile getFile() {
    Node n = getNode();
    return n.file;
  }

  public String createNode(File attachment) {
    Node n = new Node(this.label, this.description);
    n.file = JcrFile.fromFile(this.label, attachment,MimeTypes.getContentType(attachment.getName()));
    n.save();
    return n.getId();
  }


  public String toString() {
    return label;
  }

}
