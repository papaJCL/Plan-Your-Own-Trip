package com.tripco.t11.misc;

import java.lang.Math;
import java.util.Map;
import java.util.Vector;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance{
    private Map origin;
    private Map destination;
    private Float earthRadius;
    private Vector<Double> lats;
    private Vector<Double> longs;

    public GreatCircleDistance(Map origin, Map destination, float earthRadius){
        this.origin = origin;
        this.destination = destination;
        this.earthRadius = earthRadius;
        this.lats = new Vector<Double>(2);
        this.longs = new Vector<Double>(2);
    }

    public int calcDistance(){
        String[] tokens = tokenizeEntrySets();
        extractLatsAndLongs(tokens);
        convertToRadians();
        double dPhi = findCentralAngle();
        return (int)(dPhi * earthRadius);
    }

    private String[] tokenizeEntrySets(){
        String delimit =  origin.entrySet().toString().concat(destination.entrySet().toString());
        String[] tokens = delimit.split("[=,\\[\\] ]");
        return tokens;
    }

    private void extractLatsAndLongs(String[] tokens){
        for(int i = 0; i < tokens.length; ++i){
            if(tokens[i].equals("latitude")){
                double coord = checkFormat(tokens[++i]);
                lats.add(coord);
            }
            else if(tokens[i].equals("longitude")){
                double coord = checkFormat(tokens[++i]);
                longs.add(coord);
            }
        }
    }

    private double checkFormat(String token){
        double coord;
        switch(token.charAt(token.length() - 1)){
            case 'N': case 'n': case 'E': case 'e':
                coord = Double.parseDouble(token.substring(0, token.length()-1));
                return coord;
            case 'S': case 's': case 'W': case 'w':
                coord = Double.parseDouble(token.substring(0, token.length()-1)) * -1;
                return coord;
            default:
                return Double.parseDouble(token);
        }

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



}
