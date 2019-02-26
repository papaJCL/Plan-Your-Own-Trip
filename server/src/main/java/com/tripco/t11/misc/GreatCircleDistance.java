package com.tripco.t11.misc;

import java.lang.Math;
import java.util.Map;
import java.util.Vector;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance{
    private Map origin;
    private Map destination;
    private Double earthRadius;
    private Vector<Double> lats;
    private Vector<Double> longs;

    public GreatCircleDistance(Map origin, Map destination, double earthRadius){
        this.origin = origin;
        this.destination = destination;
        this.earthRadius = earthRadius;
        this.lats = new Vector<Double>(2);
        this.longs = new Vector<Double>(2);
    }

    public Long calcDistance(){
        //String[] tokens = tokenizeEntrySets();
        extractLatsAndLongs();
        convertToRadians();
        double dPhi = findCentralAngle();
        return (Math.round(dPhi * earthRadius));
    }

    /*private String[] tokenizeEntrySets(){
        String delimit =  origin.entrySet().toString().concat(destination.entrySet().toString());
        String[] tokens = delimit.split("[=,\\[\\] ]");
        return tokens;
    }*/

    private void extractLatsAndLongs(){
        lats.add(Double.parseDouble((String)origin.get("latitude")));
        lats.add(Double.parseDouble((String)destination.get("latitude")));
        longs.add(Double.parseDouble((String)origin.get("longitude")));
        longs.add(Double.parseDouble((String)destination.get("longitude")));
    }

    private void convertToRadians(){
        for(int i = 0; i < 2; ++i){
            lats.set( i, ((lats.get(i)/180) * Math.PI) );
            longs.set( i, ((longs.get(i)/180) * Math.PI) );
        }
    }
    //comment to test commits
    private double findCentralAngle(){
        //Implements Haversine formula for computing central angle
        double sinSqDeltaLat = Math.pow( ( Math.sin( Math.abs(lats.get(0) - lats.get(1) ) /2 ) ), 2 );
        double cosLat1cosLat2 = Math.cos( lats.get(0) ) * Math.cos( lats.get(1) );
        double sinSqDeltaLong = Math.pow( ( Math.sin( Math.abs(longs.get(0) - longs.get(1) ) /2 ) ), 2 );

        double dPhi = 2 * Math.asin( Math.sqrt(sinSqDeltaLat + cosLat1cosLat2 * sinSqDeltaLong) );

        return dPhi;
    }

    public String toString() {
        // Displays Map sets and other variables.
        String ret = "Variables - origin: " + origin.entrySet().toString() + " destination: "
                + destination.entrySet().toString() + " earthRadius: " + earthRadius + " Lats: ";
        // display lats
        for (int i = 0; i < lats.size() - 1; i++) ret += lats.get(i) + ", ";
        ret += lats.get(lats.size() - 1) + " "; // tidying up output
        ret += "longs: ";
        // display longs
        for (int i = 0; i < longs.size() - 1; i++) ret += longs.get(i) + ", ";
        ret += longs.get(longs.size() - 1) + "\n"; // tidying up output
        return ret;
    }

}
