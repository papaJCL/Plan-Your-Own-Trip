package com.tripco.t11.TIP;

import com.tripco.t11.misc.GreatCircleDistance;
import com.tripco.t11.misc.Optimizations;
import com.tripco.t11.misc.OptimizationsFactory;

import java.util.Arrays;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TIPItinerary extends TIPHeader {

    private Map<String, Object> options;
    protected Map<String, Object>[] places;
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
        this.distances = new Long[places.length];
        Double[][] coords = generateCoords();
        Optimizations optimize = OptimizationsFactory.getOpt((String)options.get("optimization"), coords, parseRadius());
        optimize.findOptimalTrip();
        int originIndex = calcOriginIndex(optimize.getTrip());
        coords = reAssignPlaces(originIndex, optimize.getTrip(), coords);
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

    private Double parseRadius(){
        return Double.parseDouble((String)options.get("earthRadius"));
    }

    private int calcOriginIndex(int[] trip){
        int originIndex = 0;
        for(int i = 0; i < trip.length; ++i){
            if(trip[i] == 0)
                originIndex = i;
        }
        return originIndex;
    }

    private Double[][] reAssignPlaces(int index, int[] trip, Double[][] coords){
        Map<String, Object>[] tempPlaces = new Map[places.length];
        Double[][] tempCoords = new Double[coords.length][2];
        for(int i = 0; i < tempPlaces.length; ++i){
            if(index == trip.length)
                index = 0;
            tempCoords[i] = coords[trip[index]];
            tempPlaces[i] = places[trip[index++]];
        }
        places = tempPlaces.clone();
        coords = tempCoords.clone();
        return coords;
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
        String ret = "options: " + options.toString() + "\n";
        ret += "places:\n" + places.toString();
        for(int i = 0; i < places.length; ++i){
            ret += "\t" + places[i].toString() + "\n";
        }
        ret += "distances: " + Arrays.toString(distances) + "\n";
        return ret;
    }
}
