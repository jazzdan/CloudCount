package models;

//Default play stuff 
import play.data.validation.*;

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
  @Match("[A-Za-z0-9_\\-]+")
  //searchText.matches("[A-Za-z0-9_\\-]+")
  public String label;

  @Required
  public String description;

  @Required
  public Node node;

  public Attachment(String label, String description, long userId, long budgetId, File attachment) {
    this.label = parseLabel(label);
    this.description = description;
    this.userId = userId;
    this.budgetId = budgetId;
    this.nodeId = createNode(attachment);
  }

  public Budget getBudget() {
    return Budget.findById(budgetId);
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

  public String parseLabel(String label) {
    label = label.toLowerCase();
    label = label.replaceAll("\t", " ");
    label = label.replaceAll("\f", "");
    label = label.replaceAll("\r", "");
    label = label.replaceAll("\n", "");
    if(label.startsWith("/")){
      return label;
    }
    else {
      String newLabel = "/" + label;
      return newLabel;
    }

  }

}
