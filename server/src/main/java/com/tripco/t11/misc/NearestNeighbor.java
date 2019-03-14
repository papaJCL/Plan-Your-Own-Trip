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
        for(int j = 0; j < visited.length; ++j){
            visited[j] = false;
            currentTrip[j] = -1;
        }
        visited[i] = true;
        currentTrip[0] = i;
    }

    private Long optimizeCurrentStart(int index){
        Long tripDistance = 0L;
        int placeInTrip = 1;
        while(placesAreUnvisited()){
            int nextIndex = findNextPlace(index);
            currentTrip[placeInTrip++] = nextIndex;
            visited[nextIndex] = true;
            tripDistance += distances[index][nextIndex];
            index = nextIndex;
        }
        tripDistance += distances[currentTrip[0]][currentTrip[currentTrip.length - 1]];
        return tripDistance;
    }

    private boolean placesAreUnvisited(){
        if(currentTrip[currentTrip.length - 1] == -1){
            return true;
        }
        return false;
    }

    private int findNextPlace(int index){
        Long shortest = Long.MAX_VALUE;
        int next = -1;
        for(int i = 0; i < distances[index].length; ++i){
            if((distances[index][i] < shortest && distances[index][i] != 0) && !visited[i]){
                shortest = distances[index][i];
                next = i;
            }
        }
        return next;
    }

}
