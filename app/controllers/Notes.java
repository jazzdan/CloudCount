package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

@With(Secure.class)
/**
 * Notes controller
 */
public class Notes extends Controller {

  public static void index(long budgetId){
    List<Note> notes = Note.find("by_budgetId", budgetId).asList();
    renderJSON(notes);
  }

  public static void note(long id) {
    Note note = Note.find("by_id", id).first();
    renderJSON(note);
  }

  public static void create(Note body) {
    body.save();
  }

  public static void update(Note body) {
    Note n = Note.find("by_id", body.getId()).first();
    
    n.title = body.title;
    n.contents = body.contents;
    n.budgetId = body.budgetId;

    n.save();
    renderJSON(n);
  }

  public static void delete(long id) {
    Note n = Note.find("by_id", id).first();
    n.delete();
  }
}
