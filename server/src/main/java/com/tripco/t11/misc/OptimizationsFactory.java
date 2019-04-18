package com.tripco.t11.misc;

public class OptimizationsFactory {

    public static Optimizations getOpt(String optType, Double[][] coords, Double earthRadius){

        if(optType == null){
            return new None(coords);
        }
        else if(optType.equals("short")){
            return new NearestNeighbor(coords, earthRadius);

        }else if(optType.equals("shorter")){
            return new TwoOpt(coords, earthRadius);
        }

        return new None(coords);
    }

}
