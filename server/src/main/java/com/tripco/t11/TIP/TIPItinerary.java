package com.tripco.t11.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

import com.tripco.t11.misc.GreatCircleDistance;

public class TIPItinerary extends TIPHeader {
    private Map options;
    private Map<String, Object>[] places;
    protected Long[] distances;

    private final transient Logger log = LoggerFactory.getLogger(TIPItinerary.class);

    TIPItinerary(Map options, Map<String, Object>[] places){
        this();
        this.options = options;
        this.places = places;
    }

    private TIPItinerary(){
        this.requestType = "itinerary";
        this.requestVersion = 3;
    }

    public void buildResponse(){
        this.distances = new Long[places.length];
        if(places.length != 0){
            calcDistances();
        }
        log.trace("buildResponse -> {}", this);
    }

    private Double[] parseCoords(Map<String, Object> location){
        Double[] coords = new Double[2];
        coords[0] = Double.parseDouble((String)(location.get("latitude")));
        coords[1] = Double.parseDouble((String)(location.get("longitude")));
        return coords;
    }

    private void calcDistances(){
        Float earthRadius = Float.parseFloat((String)options.get("earthRadius"));
        for(int i = 0; i < places.length - 1; ++i){
            GreatCircleDistance circle = new GreatCircleDistance(parseCoords(places[i]), parseCoords(places[i+1]), earthRadius);
            distances[i] = circle.calcDistance();
        }
        GreatCircleDistance circle = new GreatCircleDistance(parseCoords(places[0]), parseCoords(places[places.length - 1]), earthRadius);
        distances[distances.length - 1] = circle.calcDistance();
        return;
    }

    public String toString(){
        String ret = options.toString();
        ret += places.toString();
        ret += distances.toString();
        return ret;
    }
}
