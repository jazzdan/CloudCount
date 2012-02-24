package models;

import org.jcrom.JcrFile;
import org.jcrom.annotations.JcrName;
import org.jcrom.annotations.JcrNode;
import org.jcrom.annotations.JcrProperty;
import org.jcrom.annotations.JcrReference;
import org.jcrom.annotations.JcrFileNode;

import play.data.validation.Required;
import play.modules.cream.Model;

@JcrNode(mixinTypes = { "mix:created", "mix:lastModified", "mix:versionable" })
public class Node extends Model {

    @JcrName
    @Required
    public String label;

    @JcrProperty
    public String description;

    @JcrFileNode
    public JcrFile file;

    // @JcrReference
    // public Attachment attachment;

    public Node(String label, String description) {
      this.label = label;
      this.description = description;
    }

    public String toString() {
        return label;
    }
}
