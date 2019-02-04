package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Vector;
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
  private int distance;
  private Vector<Double> lats = new Vector<Double>(2);
  private Vector<Double> longs = new Vector<Double>(2);

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPDistance(int version, Map origin, Map destination, float earthRadius) {
    this();
    this.requestVersion = version;
    this.origin = origin;
    this.destination = destination;
    this.earthRadius = earthRadius;
    this.distance = 0;
  }


  private TIPDistance() {
    this.requestType = "distance";
  }


  @Override
  public void buildResponse() {

    this.distance = getDistance();                    //Write a method here to changed the distance between the two points. Static class. Distance between two points.
    log.trace("buildResponse -> {}", this);
  }


  int getDistance() {

    return distance = calcDistance();

  }

  int calcDistance(){

    String[] tokens = tokenizeEntrySets();
    extractLatsAndLongs(tokens);
    convertToRadians();
    double dPhi = findCentralAngle();
    return (int)(dPhi * earthRadius);

  }

  String[] tokenizeEntrySets(){

    String delimit =  origin.entrySet().toString().concat(destination.entrySet().toString());
    String[] tokens = delimit.split("[=,\\[\\] ]");
    return tokens;

  }

  void extractLatsAndLongs(String[] tokens){

    for(int i = 0; i < tokens.length; ++i){
      if(tokens[i].equals("latitude")){
        lats.add(Double.parseDouble(tokens[++i]));
      }
      else if(tokens[i].equals("longitude")){
        longs.add(Double.parseDouble(tokens[++i]));
      }
    }

  }

  void convertToRadians(){

    for(int i = 0; i < 2; ++i){
      lats.set( i, ((lats.get(i)/180) * Math.PI) );
      longs.set( i, ((longs.get(i)/180) * Math.PI) );
    }

  }

  double findCentralAngle(){
    //Implements Haversine formula for computing central angle
    double sinSqDeltaLat = Math.pow( ( Math.sin( Math.abs(lats.get(0) - lats.get(1) ) /2 ) ), 2 );
    double cosLat1cosLat2 = Math.cos( lats.get(0) ) * Math.cos( lats.get(1) );
    double sinSqDeltaLong = Math.pow( ( Math.sin( Math.abs(longs.get(0) - longs.get(1) ) /2 ) ), 2 );

    double dPhi = 2 * Math.asin( Math.sqrt(sinSqDeltaLat + cosLat1cosLat2 * sinSqDeltaLong) );

    return dPhi;

  }

}
