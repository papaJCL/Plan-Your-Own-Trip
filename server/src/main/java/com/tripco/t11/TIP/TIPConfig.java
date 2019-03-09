package com.tripco.t11.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

/** This class defines the Config response that provides the client
 * with server specific configuration information.
 *  
 * When used with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to set the configuration information.
 * The MicroServer constructs the response JSON from the object using GSON.
 *  
 * When used for testing purposes,
 * An object is created using the constructor below.
 * The buildResponse method is called to set the configuration information.
 * The getDistance method is called to obtain the distance value for comparisons.
 */
public class TIPConfig extends TIPHeader {
  private String serverName;
  private List<String> placeAttributes;
  private List<String> optimizations;

  private final transient Logger log = LoggerFactory.getLogger(TIPConfig.class);


  public TIPConfig() {
    this.requestType = "config";
    this.requestVersion = 3;
  }


  @Override
  public void buildResponse() {
    this.serverName = "t11 Ultra Super Team Delta";
    this.placeAttributes = Arrays.asList("name", "latitude", "longitude", "id", "municipality", "altitude");
    this.optimizations = Arrays.asList("none");
    log.trace("buildResponse -> {}", this);
  }


  String getServerName() {
    return this.serverName;
  }


  List<String> getPlaceAttributes() {
    return this.placeAttributes;
  }

  List<String> getOptimizationOptions() { return this.optimizations; }

  public String toString() {
    String ret = "Variables - serverName: " + serverName +" placeAttributes: ";
    for (int i = 0; i < placeAttributes.size() - 1; i++) ret += placeAttributes.get(i) + ", "; // display placeAttributes
    ret += placeAttributes.get(placeAttributes.size() - 1) + "\n"; // tidying up output
    return ret;
  }

}
