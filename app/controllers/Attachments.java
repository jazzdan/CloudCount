/*package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import org.jcrom.JcrFile;
import org.jcrom.JcrMappingException;

import play.modules.cream.JCR;
import play.modules.cream.ocm.JcrMapper;
import play.modules.cream.ocm.JcrQueryResult;
import play.modules.cream.ocm.JcrVersionMapper;

import models.User;
import models.Node;
import models.Attachment;

@with(Secure.class)
public class Attachments extends Controller {
  public static void create(String label, String description, File file) {

    Node n = new Node(label, description);
    Attachment a = new Attachment(label, description, Secure.connectedUser(), 
    if(file != null){
      addFileToNode(file);
    }
  }
}*/
