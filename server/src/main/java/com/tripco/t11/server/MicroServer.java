package com.tripco.t11.server;

import com.google.gson.Gson;

import com.tripco.t11.TIP.TIPConfig;
import com.tripco.t11.TIP.TIPDistance;
import com.tripco.t11.TIP.TIPFind;
import com.tripco.t11.TIP.TIPItinerary;
import com.tripco.t11.TIP.TIPHeader;

import java.lang.reflect.Type;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import org.everit.json.schema.SchemaException;
import org.everit.json.schema.loader.SchemaLoader;
import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import spark.Request;
import spark.Response;
import spark.Spark;
import static spark.Spark.secure;



/** A micro server for a single page web application that serves the static files
 * and processes restful API requests.
 */
class MicroServer {

  private final Logger log = LoggerFactory.getLogger(MicroServer.class);


  MicroServer(int serverPort) {
    configureServer(serverPort);
    serveStaticPages();
    processRestfulAPIrequests();
    log.info("MicroServer running on port: {}", serverPort);
  }


  private void configureServer(int serverPort) {
    Spark.port(serverPort);
    String keystoreFile = System.getenv("KEYSTORE_FILE");
    String keystorePassword = System.getenv("KEYSTORE_PASSWORD");
    if (keystoreFile != null && keystorePassword != null) {
      secure(keystoreFile, keystorePassword, null, null);
      log.info("Keystore file: {}", keystoreFile);
      log.info("Keystore password: {}", keystorePassword);
      log.info("MicroServer using HTTPS.");
    }
    else {
      log.info("MicroServer using HTTP.");
    }
    log.trace("Server configuration complete");
  }


  private void serveStaticPages() {
    String path = "/public/";
    Spark.staticFileLocation(path);
    Spark.get("/", (req, res) -> { res.redirect("index.html"); return null; });
    log.trace("Static file configuration complete");
  }


  private void processRestfulAPIrequests() {
    Spark.get("/api/config", this::processTIPconfigRequest);
    Spark.post("/api/distance", this::processTIPdistanceRequest);
    Spark.get("/api/echo", this::echoHTTPrequest);
    Spark.post("/api/itinerary", this::processTIPitineraryRequest);
    Spark.post("/api/find", this::processTIPFindRequest);
    log.trace("Restful configuration complete");
  }


  private String processTIPconfigRequest(Request request, Response response) {
    log.info("TIP Config request: {}", HTTPrequestToJson(request));
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.status(200);
    try {
      Gson jsonConverter = new Gson();
      TIPConfig tipRequest = new TIPConfig();
      tipRequest.buildResponse();
      String responseBody = jsonConverter.toJson(tipRequest);
      log.trace("TIP Config response: {}", responseBody);
      return responseBody;
    } catch (Exception e) {
      log.error("Exception: {}", e);
      response.status(500);
      return request.body();
    }
  }


  private String processTIPdistanceRequest(Request request, Response response) {
    return processTIPrequest(TIPDistance.class, request, response);
  }

  private String processTIPitineraryRequest(Request request, Response response){
    return processTIPrequest(TIPItinerary.class, request, response);
  }

  private String processTIPFindRequest(Request request, Response response){
    return processTIPrequest(TIPFind.class, request, response);
  }


  private String processTIPrequest(Type tipType, Request request, Response response) {
    log.info("TIP Request: {}", HTTPrequestToJson(request));
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.status(200);
    try {
      Gson jsonConverter = new Gson();

      boolean isGood = validateRequest(request, tipType);
      if(isGood == false){
        response.status(400);
        return request.body();
      }

      TIPHeader tipRequest = jsonConverter.fromJson(request.body(), tipType);
      tipRequest.buildResponse();
      String responseBody = jsonConverter.toJson(tipRequest);
      log.trace("TIP Response: {}", responseBody);
      return responseBody;
    } catch (Exception e) {
      log.error("Exception: {}", e);
      response.status(500);
      return request.body();
    }
  }

  private static boolean validateRequest(Request request, Type tipType){
    boolean isValid = false;
    JSONObject toBeValidated = new JSONObject(request.body());
    if(tipType == TIPConfig.class){
      JSONObject config = parseJsonFile("server/src/resources/TIPConfigSchema.json");
      isValid = performValidation(toBeValidated, config);
    }else if(tipType == TIPDistance.class){
      JSONObject distance = parseJsonFile("server/src/resources/TIPDistancSchema.json");
      isValid = performValidation(toBeValidated, distance);
    }else if(tipType == TIPFind.class){
      JSONObject find = parseJsonFile("server/src/resources/TIPFindSchema.json");
      isValid = performValidation(toBeValidated, find);
    }else if(tipType == TIPItinerary.class){
      JSONObject itinierary = parseJsonFile("server/src/resources/TIPItinerarySchema.json");
      isValid = performValidation(toBeValidated, itinierary);
    }
    return isValid;
  }

  private String echoHTTPrequest(Request request, Response response) {
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    return HTTPrequestToJson(request);
  }


  private String HTTPrequestToJson(Request request) {
    return "{\n"
        + "\"attributes\":\"" + request.attributes() + "\",\n"
        + "\"body\":\"" + request.body() + "\",\n"
        + "\"contentLength\":\"" + request.contentLength() + "\",\n"
        + "\"contentType\":\"" + request.contentType() + "\",\n"
        + "\"contextPath\":\"" + request.contextPath() + "\",\n"
        + "\"cookies\":\"" + request.cookies() + "\",\n"
        + "\"headers\":\"" + request.headers() + "\",\n"
        + "\"host\":\"" + request.host() + "\",\n"
        + "\"ip\":\"" + request.ip() + "\",\n"
        + "\"params\":\"" + request.params() + "\",\n"
        + "\"pathInfo\":\"" + request.pathInfo() + "\",\n"
        + "\"serverPort\":\"" + request.port() + "\",\n"
        + "\"protocol\":\"" + request.protocol() + "\",\n"
        + "\"queryParams\":\"" + request.queryParams() + "\",\n"
        + "\"requestMethod\":\"" + request.requestMethod() + "\",\n"
        + "\"scheme\":\"" + request.scheme() + "\",\n"
        + "\"servletPath\":\"" + request.servletPath() + "\",\n"
        + "\"session\":\"" + request.session() + "\",\n"
        + "\"uri()\":\"" + request.uri() + "\",\n"
        + "\"url()\":\"" + request.url() + "\",\n"
        + "\"userAgent\":\"" + request.userAgent() + "\"\n"
        + "}";
  }

  private static boolean performValidation(JSONObject json, JSONObject jsonSchema) {
    boolean validationResult = true;
    try {
      Schema schema = SchemaLoader.load(jsonSchema);
      // This is the line that will throw a ValidationException if anything doesn't conform to the schema!
      schema.validate(json);
    }
    catch (SchemaException e) {
      e.printStackTrace();
      validationResult = false;
    }
    catch (ValidationException e) {
      // For now, messages are probably just good for debugging, to see why something failed
      List<String> allMessages = e.getAllMessages();
      for (String message : allMessages) {

      }
      validationResult = false;
    }
    finally {
      return validationResult;
    }
  }

  private static JSONObject parseJsonFile(String path) {
    // Here, we simply dump the contents of a file into a String (and then an object);
    // there are other ways of creating a JSONObject, like from an InputStream...
    // (https://github.com/everit-org/json-schema#quickstart)
    JSONObject parsedObject = null;
    try {
      byte[] jsonBytes = Files.readAllBytes(Paths.get(path));
      parsedObject = new JSONObject(new String(jsonBytes));
    }
    catch (IOException e) {
      e.printStackTrace();
    }
    catch (JSONException e) {
      e.printStackTrace();
    }
    finally {
      return parsedObject;
    }
  }

}
