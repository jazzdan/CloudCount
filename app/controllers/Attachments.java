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

    // logging
    System.out.println("label: " + label);
    System.out.println("description: " + description);
    System.out.println("bid: " + budgetId);
    System.out.println("uid: " + uid);

    // make the attachment
    Attachment a = new Attachment(label, description, uid, budgetId, attachment);
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
  public static void showFile(long attachmentId){
    Attachment a = Attachment.findById(attachmentId);
    JcrFile j = a.getFile();
    response.setContentTypeIfNotSet(j.getMimeType());
    renderBinary(j.getDataProvider().getInputStream());
  }

  /**
   * Deletes the requested attachment associated with the budgetId
   *
   * @param budgetId budgetId of the associated budget. This is
   * necessary for constructing the URL in javascript
   * @param attachmentId id of the attachment to be deleted
   */

  public static void delete(long budgetId, long attachmentId) {
    Attachment a = Attachment.find("by_id", attachmentId).first();
    a.delete();
  }

}
