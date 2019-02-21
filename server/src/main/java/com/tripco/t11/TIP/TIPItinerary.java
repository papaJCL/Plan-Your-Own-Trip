package com.tripco.t11.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Vector;

import com.tripco.t11.misc.GreatCircleDistance;

public class TIPItinerary extends TIPHeader {
    private Map options;
    private Vector<Map> places;
    private Vector<Long> distances;

    private final transient Logger log = LoggerFactory.getLogger(TIPItinerary.class);

    TIPItinerary(Map options, Vector<Map> places, Vector<Long> distances){
        this();
        this.options = options;
        this.places = places;
        this.distances = distances;
    }

    private TIPItinerary(){
        this.requestType = "itinerary";
        this.requestVersion = 2;
    }

    public void buildResponse(){
        calcDistances();
        log.trace("buildResponse -> {}", this);;
    }

    private void calcDistances(){
        Float earthRadius = Float.parseFloat((String)options.get("earthRadius"));
        for(int i = 0; i < places.size() - 1; ++i){
            GreatCircleDistance circle = new GreatCircleDistance(places.get(i), places.get(i+1), earthRadius);
            distances.add(circle.calcDistance());
        }
        GreatCircleDistance circle = new GreatCircleDistance(places.get(0), places.get(places.size()-1), earthRadius);
        distances.add(circle.calcDistance());
        return;
    }

    public String toString(){
        String ret = options.toString();
        ret += places.toString();
        ret += distances.toString();
        return ret;
    }
}
