package com.tripco.t11.misc;

/**
 *
 */

public class NearestNeighbor extends Optimizations {


    int[] trip;
    int[] currentTrip;
    Long[][] distances;
    Long bestDistance;
    private boolean[] visited;

    NearestNeighbor(Double[][] coords, Double earthRadius){
        this.trip = new int[coords.length];
        this.currentTrip = new int[coords.length];
        generateDistances(coords, earthRadius);
        this.visited = new boolean[coords.length];
    }

    private void generateDistances(Double[][] coords, Double earthRadius){
        this.distances = new Long[coords.length][coords.length];
        for(int i = 0; i < coords.length; ++i){
            distances[i][i] = 0L;
            for(int j = i + 1; j < coords.length; ++j){
                GreatCircleDistance circle = new GreatCircleDistance(coords[i], coords[j], earthRadius);
                distances[i][j] = circle.calcDistance();
                distances[j][i] = distances[i][j];
            }
        }
    }

    @Override
    public void findOptimalTrip(){
        Long currentBest = Long.MAX_VALUE;
        for(int i = 0; i < distances.length; ++i){
            assignVisited(i);
            calcBestDistance(i);
            if(bestDistance < currentBest) {
                currentBest = bestDistance;
                System.arraycopy(currentTrip, 0, trip, 0, trip.length);
            }
        }
    }

    protected void assignVisited(int index){
        for(int j = 0; j < visited.length; ++j){
            visited[j] = false;
            currentTrip[j] = -1;
        }
        visited[index] = true;
        currentTrip[0] = index;
    }

    void calcBestDistance(int index){
        bestDistance = 0L;
        int placeInTrip = 1;
        while(placesAreUnvisited()){
            int nextIndex = findNextPlace(index);
            currentTrip[placeInTrip++] = nextIndex;
            visited[nextIndex] = true;
            bestDistance += distances[index][nextIndex];
            index = nextIndex;
        }
        bestDistance += distances[currentTrip[0]][currentTrip[currentTrip.length - 1]];
    }


    private boolean placesAreUnvisited(){
        return (currentTrip[currentTrip.length - 1] == -1);

    }

    protected int findNextPlace(int index){
        Long shortest = Long.MAX_VALUE;
        int next = -1;
        for(int i = 0; i < distances[index].length; ++i) {
            if (distances[index][i] < shortest && index != i && !visited[i]) {
                shortest = distances[index][i];
                next = i;
            }
        }
        return next;
    }

    @Override
    public int[] getTrip(){
        return this.trip;
    }

}