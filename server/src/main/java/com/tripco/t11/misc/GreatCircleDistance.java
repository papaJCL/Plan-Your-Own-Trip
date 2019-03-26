package com.tripco.t11.misc;

import java.lang.Math;

import java.util.Arrays;

/** Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance{
    private Double[] origin;
    private Double[] destination;
    private Double earthRadius;

    public GreatCircleDistance(Double[] origin, Double[] destination, double earthRadius){
        this.origin = origin.clone();
        this.destination = destination.clone();
        this.earthRadius = earthRadius;
    }

    public Long calcDistance(){
        convertToRadians();
        double dPhi = findCentralAngle();
        return (Math.round(dPhi * earthRadius));
    }

    private void convertToRadians(){
        for(int i = 0; i < 2; ++i){
            origin[i] = ((origin[i]/180.0D) * Math.PI);
            destination[i] = ((destination[i]/180.0D) * Math.PI);
        }
    }

    private double findCentralAngle(){
        //Implements Haversine formula for computing central angle
        double sinSqDeltaLat = Math.pow( ( Math.sin( Math.abs(origin[0] - destination[0]) /2.0D ) ), 2 );
        double cosLat1cosLat2 = Math.cos( origin[0] ) * Math.cos( destination[0] );
        double sinSqDeltaLong = Math.pow( ( Math.sin( Math.abs(origin[1] - destination[1] ) /2.0D ) ), 2 );

        double dPhi = 2 * Math.asin( Math.sqrt(sinSqDeltaLat + cosLat1cosLat2 * sinSqDeltaLong) );

        return dPhi;
    }

    public String toString() {
        // Displays Map sets and other variables.
        String ret = "origin coordinates: " + Arrays.toString(origin) + "\n";
        ret += "destination coordinates: " + Arrays.toString(destination) + "\n";
        ret += "earth radius: " + earthRadius + "\n";
        return ret;
    }

}
