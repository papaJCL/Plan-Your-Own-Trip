package com.tripco.t11.TIP;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import com.tripco.t11.misc.GreatCircleDistance;
import com.tripco.t11.misc.NearestNeighbor;

public class TIPItinerary extends TIPHeader {
    private Map<String, Object> options;
    private Map<String, Object>[] places;
    protected Long[] distances;

    private final transient Logger log = LoggerFactory.getLogger(TIPItinerary.class);

    TIPItinerary(Map<String, Object> options, Map<String, Object>[] places){
        this();
        this.options = options;
        this.places = places;
    }

    private TIPItinerary(){
        this.requestType = "itinerary";
        this.requestVersion = 3;
    }

    @Override
    public void buildResponse(){
        Double[][] coords = generateCoords();
        this.distances = new Long[places.length];
        if(options.get("optimization") != null){
            if(options.get("optimization").equals("short")) {
                NearestNeighbor optimize = new NearestNeighbor(coords, parseRadius());
                optimize.findOptimalTrip();
                reAssignPlaces(optimize.trip);
            }
        }
        if (places.length != 0) {
            calcDistances(coords);
        }
        log.trace("buildResponse -> {}", this);
    }

    private Double[][] generateCoords(){
        Double[][] coords = new Double[places.length][2];
        for(int i = 0; i < places.length; ++i){
            coords[i] = parseCoords(places[i]);
        }
        return coords;
    }

    private void reAssignPlaces(int[] trip){
        Map<String, Object>[] temp = new Map[places.length];
        for(int i = 0; i < temp.length; ++i){
            temp[i] = places[trip[i]];
        }
        places = temp.clone();
    }

    private Double parseRadius(){
        return Double.parseDouble((String)options.get("earthRadius"));
    }

    private void calcDistances(Double[][] coords){
        for(int i = 0; i < places.length - 1; ++i){
            GreatCircleDistance circle = new GreatCircleDistance(coords[i], coords[i+1], parseRadius());
            distances[i] = circle.calcDistance();
        }
        GreatCircleDistance circle = new GreatCircleDistance(coords[0], coords[places.length-1], parseRadius());
        distances[distances.length - 1] = circle.calcDistance();
        return;
    }

    @Override
    public String toString(){
        String ret = "options: " + options.toString();
        ret += "\nplaces: " + places.toString();
        ret += "\ndistances: " + distances.toString();
        return ret;
    }
}
