package com.tripco.t11.misc;

public class None extends Optimizations {

    private int[] trip;
    private Double[][] coords;

    public None(Double[][] coords){
        this.coords = coords;
        this.trip = new int[coords.length];
    }

    @Override
    public void findOptimalTrip(){
        for(int i = 0; i < coords.length; ++i){
            trip[i] = i;
        }
    }

    @Override
    public int[] getTrip(){
        return this.trip;
    }

}
