package plugins;

import play.*; 
import play.mvc.*; 
import com.google.gson.*; 

import java.util.*; 
import java.lang.reflect.*; 
import java.lang.annotation.*; 

/**
 * This plugin finds any parameters to a function named body and
 * automatically serializes to JSON.
 */

public class BinderPlugin extends PlayPlugin
{ 
    public Object bind(String name, Class clazz, Type type, Annotation[] annotations, Map<String, String[]> params)
    { 
        if (Http.Request.current().contentType.equals("application/json"))
        {
            if (name.equals("body"))
            {
                return new Gson().fromJson(Scope.Params.current().get("body"), clazz);
            }
        } 
        return null; 
    }
}
