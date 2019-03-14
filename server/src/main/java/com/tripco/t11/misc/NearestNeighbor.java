package com.tripco.t11.misc;



public class NearestNeighbor extends Optimizations {

    public int[] trip;
    public int[] currentTrip;
    private Long bestDist;
    private Long[][] distances;
    private boolean[] visited;

    public NearestNeighbor(Double[][] coords, Double earthRadius){
        this.trip = new int[coords.length];
        this.currentTrip = new int[coords.length];
        //generateDistances(coords, earthRadius);
        this.visited = new boolean[coords.length];
        this.bestDist = Long.MAX_VALUE;
    }



}
