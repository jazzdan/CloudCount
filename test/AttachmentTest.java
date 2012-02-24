import org.junit.*;
import java.util.*;
import play.test.*;
import models.Attachment;

import play.modules.morphia.Blob;
import play.modules.morphia.MorphiaPlugin;

public class AttachmentTest extends UnitTest {
  
  @Test
  public void aVeryImportantThingToTest() {
    assertEquals(2, 1 + 1);
  }

  @Test
  public void testStoreAttachment() {
    Attachment a = new Attachment("derp/derp", "test attachment");
    a.save();
    a.delete();
  }
}
