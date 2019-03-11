package com.tripco.t11.TIP;

import java.util.Map;

public abstract class TIPHeader {
  protected Integer requestVersion;
  protected String requestType;

  protected Double[] parseCoords(Map<String, Object> location){
    Double[] coords = new Double[2];
    coords[0] = Double.parseDouble((String)(location.get("latitude")));
    coords[1] = Double.parseDouble((String)(location.get("longitude")));
    return coords;
  }

  public abstract String toString();

  public abstract void buildResponse();
}
