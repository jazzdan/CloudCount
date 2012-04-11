import play.test.*;
import org.junit.*;
import java.util.*;
import play.mvc.*;
import play.mvc.Http.*;

import play.modules.morphia.Blob;
import play.modules.morphia.MorphiaPlugin;

public class BudgetFunctionalTest extends FunctionalTest {
  
  @Test
  public void testBudgetPage() {
    // Response response = POST
    Map<String, String> loginUserParams = new HashMap<String, String>();
    loginUserParams.put("username", "derp@derp.com");
    loginUserParams.put("password", "derp");

    Response loginResponse = POST("/login", loginUserParams);

    Request request = newRequest();
    request.cookies = loginResponse.cookies; // this makes the connection auth'd
    request.url = "/budgets";
    request.method = "GET";
    Response response = makeRequest(request);
    assertIsOk(response);
  }

}
