package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

// @With(Secure.class)

/*
Transactions controller
*/
public class Transactions extends Controller {

	public static void index(long transactionId) {
		List<Transaction> transactions = Transaction.find("transactionId", transactionId).asList();
		renderJSON(transactions);
	}

	public static void transaction(long id) {
		Transaction t = Transaction.find("by_id", id).first();
		renderJSON(t);
	}

	public static void create(Transaction body) {
		User user = User.find("byEmail", Security.connected()).first();

		body.user = user;
		body.save();
	}

	public static void update(Transaction body) {
		Transaction t = Transaction.find("by_id", body.getId()).first();
		Budget b = Budget.find("by_id", body).first();
		User user = User.find("byEmail", Security.connected()).first();

		t.user = user;
		//t.budget = something TODO: Fix this
		t.subline_number = body.subline_number;
		t.name = body.name;
		t.subtotal = body.subtotal;
		t.subline_id = body.subline_id;
		t.order = body.order;

		t.save();
		renderJSON(t);
	}

	public static void delete(long id){
		Transaction t = Transaction.find("by_id", id).first();
		t.delete();
	}

}