package models;
 
import play.data.validation.Email;
import play.data.validation.Required;
import play.modules.morphia.Model;
import play.modules.morphia.Model.AutoTimestamp;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Indexed;

@AutoTimestamp
@Entity
public class Audit extends Model {

	@Required
	@Indexed
	public long userId;

	@Required
	@Indexed
	public long audited_id;

	@Required
	public String audited_type;

	@Required
	public String action;

	public String comment;

	public String remote_address;

	public Audit(long userId, long audited_id, String audited_type, String action){
		this.userId = userId;
		this.audited_id = audited_id;
		this.audited_type = audited_type;
		this.action = action;
	}
}