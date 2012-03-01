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

@With(Secure.class)
public class Attachments extends Controller {

  public static void index(long budgetId) {
    List<Attachment> attachments = Attachment.q().filter("budgetId", budgetId).asList();
    renderJSON(attachments);
  }

  public static void form(long budgetId) {
    render(budgetId);
  }

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

  public static void showFile(long attachmentId){
    Attachment a = Attachment.findById(attachmentId);
    JcrFile j = a.getFile();
    response.setContentTypeIfNotSet(j.getMimeType());
    renderBinary(j.getDataProvider().getInputStream());
  }

}
