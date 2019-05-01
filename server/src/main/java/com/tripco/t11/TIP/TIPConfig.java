package com.tripco.t11.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
  protected List<String> placeAttributes;
  private List<String> optimizations;
  private Map<String, Object>[] filters;

  private final transient Logger log = LoggerFactory.getLogger(TIPConfig.class);

  public TIPConfig() {
    this.requestType = "config";
    this.requestVersion = 4;
  }

  @Override
  public void buildResponse() {
    this.serverName = "t11 Ultra Super Team Delta";
    this.placeAttributes = Arrays.asList("name", "latitude", "longitude", "id", "municipality", "region", "country", "continent", "altitude");
    this.optimizations = Arrays.asList("none", "short", "shorter");
    this.filters = assignFilters();
    log.trace("buildResponse -> {}", this);
  }

  Map<String,Object>[] assignFilters(){
    Map<String, Object>[] filters = new HashMap[1];
    Map<String, Object> filter = new HashMap<>();
    filter.put("name", "type");
    String[] values = new String[] {"airport","heliport","balloonport"};
    filter.put("values", values);
    filters[0] = filter;
    return filters;
  }

  String getServerName() { return this.serverName; }

  List<String> getPlaceAttributes() { return this.placeAttributes; }

  List<String> getOptimizationOptions() { return this.optimizations; }

  Map<String, Object>[] getFilters() { return this.filters; }

  public String toString() {
    String ret = "Variables - serverName: " + serverName + "\n";
    ret += "placeAttributes:\n";
    for (int i = 0; i < placeAttributes.size(); ++i) {
      ret += "\t" + placeAttributes.get(i) + "\n";
    }
    ret += "optimizations:\n";
    for(int i = 0; i < optimizations.size(); ++i){
      ret += "\t" + optimizations.get(i) + "\n";
    }
    return ret;
  }

}
