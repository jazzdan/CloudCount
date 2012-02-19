import org.junit.*;
import java.util.*;
import play.test.*;
import models.User;

import play.modules.morphia.Blob;
import play.modules.morphia.MorphiaPlugin;

public class UserTest extends UnitTest {

    @Test
    public void aVeryImportantThingToTest() {
        assertEquals(2, 1 + 1);
    }

    @Test
    public void testDefaultStoreUser() {
      User u = new User();
      u.save();

      assertNotNull(u.username);
      assertEquals("derp", u.username);
      assertNotNull(u.email);
    }

    @Test
    public void testStoreUser() {
      User u = new User("jazzdan", "Miller", "Dan", "jazzdan@gmail.com", true);
      u.save();
    }

}