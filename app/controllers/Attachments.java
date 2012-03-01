package controllers;

import play.*;
import play.mvc.*;

import java.util.*;
import java.io.File;

import org.jcrom.JcrFile;
import org.jcrom.JcrMappingException;

import play.modules.cream.JCR;
import play.modules.cream.ocm.JcrMapper;
import play.modules.cream.ocm.JcrQueryResult;
import play.modules.cream.ocm.JcrVersionMapper;
import play.libs.MimeTypes;

import models.User;
import models.Node;
import models.Attachment;


/**
 * The attachments controller class handles the uploading and retrieval of
 * attachments.
 */
@With(Secure.class)
public class Attachments extends Controller {

  /**
   * Takes a budgetId and returns all budgets associated with that
   * budget. It then renders the JSON representation of that object to
   * the view.
   *
   * @param  budgetId The id of the requested budget
   */
  public static void index(long budgetId) {
    List<Attachment> attachments = Attachment.q().filter("budgetId", budgetId).asList();
    renderJSON(attachments);
  }

  public static void form(long budgetId) {
    render(budgetId);
  }

  /**
   * Creates an attachment associated with a budget and a jackrabbit
   * node.
   *
   * @param budgetId The id of the budget the attachment is associated
   * with
   * @param label The desired label of the jackrabbit node
   * @param description The descripton of this particular attachment
   * @param attachment A binary file uploaded by the user
   */
  public static void create(long budgetId, String label, String description, File attachment){

    // find the user
    User user = User.find("byEmail", Security.connected()).first();
    long uid = user.getNumId();

    String uname = user.first_name + " " + user.last_name;
System.out.println(uname);
    // make the attachment
    Attachment a = new Attachment(label, description, uid, uname, budgetId, attachment);
    a.save();

    // render the thank you form
    render(label);
  }
  /**
   * Renders an existing attachment to the screen so that it can be
   * downloaded by the user.
   *
   * @param attachmentId The id of the requested attachment
   */

  public static void show(long attachmentId){
    Attachment a = Attachment.findById(attachmentId);
    JcrFile j = a.getFile();
    response.setContentTypeIfNotSet(j.getMimeType());
    renderBinary(j.getDataProvider().getInputStream());
  }

  /**
   * Deletes the requested attachment associated with the budgetId
   *
   * @param attachmentId id of the attachment to be deleted
   */

  public static void delete(long attachmentId) {
    Attachment a = Attachment.find("by_id", attachmentId).first();
    a.delete();
  }

}
