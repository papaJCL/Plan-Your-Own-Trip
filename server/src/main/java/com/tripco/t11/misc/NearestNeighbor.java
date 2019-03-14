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
        generateDistances(coords, earthRadius);
        this.visited = new boolean[coords.length];
        this.bestDist = Long.MAX_VALUE;
    }

    private void generateDistances(Double[][] coords, Double earthRadius){
        this.distances = new Long[coords.length][coords.length];
        for(int i = 0; i < coords.length; ++i){
            for(int j = 0; j < coords.length; ++j){
                GreatCircleDistance circle = new GreatCircleDistance(coords[i], coords[j], earthRadius);
                distances[i][j] = circle.calcDistance();
            }
        }
        return;
    }

    public void findOptimalTrip(){
        for(int i = 0; i < distances.length; ++i){
            assignVisited(i);
            Long currentDist = optimizeCurrentStart(i);
            if(currentDist < bestDist) {
                bestDist = currentDist;
                trip = currentTrip.clone();
            }
        }
    }

    private void assignVisited(int i){

    }

    private Long optimizeCurrentStart(int i){
        return 0L;
    }

}
