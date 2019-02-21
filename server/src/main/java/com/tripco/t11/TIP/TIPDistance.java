package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;


/** Defines the TIP distance object.
 *
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to determine the distance.
 * The MicroServer constructs the response JSON from the object using GSON.
 *
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to determine the distance.
 * The getDistance method is called to obtain the distance value for comparisons.
 *
 */
public class TIPDistance extends TIPHeader {
  private Map origin;
  private Map destination;
  private Float earthRadius;
  private Long distance;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);

  TIPDistance(int version, Map origin, Map destination, float earthRadius) {
    this();
    this.requestVersion = version;
    this.origin = origin;
    this.destination = destination;
    this.earthRadius = earthRadius;
    this.distance = 0L;
  }

  private TIPDistance() { this.requestType = "distance"; }

  @Override
  public void buildResponse() {
    GreatCircleDistance circle = new GreatCircleDistance(origin, destination, earthRadius);
    this.distance = circle.calcDistance();        //Write a method here to changed the distance between the two points. Static class. Distance between two points.
    log.trace("buildResponse -> {}", this);

  }


  Long getDistance() {
    return distance;
  }

  public String toString() {
    String ret = "Variables - origin: " + origin.entrySet().toString() + " destination: "
            + destination.entrySet().toString() + " earthRadius: " + earthRadius + " distance: " + distance + "\n";
    return ret;
  }

}
