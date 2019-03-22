package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import com.tripco.t11.misc.NearestNeighbor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class TIPItinerary extends TIPHeader {
    private Map<String, Object> options;
    private Map<String, Object>[] places;
    protected Long[] distances;

    private final transient Logger log = LoggerFactory.getLogger(TIPItinerary.class);

    TIPItinerary(int version, Map<String, Object> options, Map<String, Object>[] places){
        this();
        this.requestVersion = version;
        this.options = options;
        this.places = places;
    }

    private TIPItinerary(){ this.requestType = "itinerary"; }

    @Override
    public void buildResponse(){
        Double[][] coords = generateCoords();
        this.distances = new Long[places.length];
        if(options.get("optimization") != null){
            if(options.get("optimization").equals("short")) {
                NearestNeighbor optimize = new NearestNeighbor(coords, parseRadius());
                optimize.findOptimalTrip();
                coords = reAssignPlaces(optimize.trip, coords);
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

    private Double[][] reAssignPlaces(int[] trip, Double[][] coords){
        int j = 0;
        for(int i = 0; i < trip.length; ++i){
            if(trip[i] == 0)
                j = i;
        }
        Map<String, Object>[] tempPlaces = new Map[places.length];
        Double[][] tempCoords = new Double[coords.length][2];
        for(int i = 0; i < tempPlaces.length; ++i){
            if(j == trip.length)
                j = 0;
            tempCoords[i] = coords[trip[j]];
            tempPlaces[i] = places[trip[j]];
            j++;
        }
        places = tempPlaces.clone();
        coords = tempCoords.clone();
        return coords;
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
