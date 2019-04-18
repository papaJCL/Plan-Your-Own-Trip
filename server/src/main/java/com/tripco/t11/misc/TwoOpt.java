package com.tripco.t11.misc;


public class TwoOpt extends NearestNeighbor{

    TwoOpt(Double[][] coords, Double earthRadius){
        super(coords,earthRadius);
    }

    @Override
    public void findOptimalTrip(){
        super.findOptimalTrip();
    }

    void calcBestDistance(int index) {
        super.calcBestDistance(index);
        calcTwoOptDistance();
    }

    private void calcTwoOptDistance(){
        boolean canImprove = true;
        while (canImprove) {
            canImprove = false;
            Long twoOptDistance = calcCurrentTwoOpt(bestDistance);
            if(twoOptDistance < bestDistance){
                bestDistance = twoOptDistance;
                canImprove = true;
            }
        }
    }

    private Long calcCurrentTwoOpt(Long distance){
        for (int i = 0; i < (currentTrip.length - 3); ++i) {
            for (int k = i + 2; k < currentTrip.length - 1; ++k) {
                distance += addDelta(i, k);
            }
        }
        return distance;
    }

    private Long addDelta(int start, int end){
        Long delta = calcDelta(start, end);
        if (delta < 0) {
            uncrossTrip(start + 1, end);
            return delta;
        }
        return 0L;
    }

    private Long calcDelta(int start, int end){
        return    (-1*distances[currentTrip[start]][currentTrip[start+1]])
                + (-1*distances[currentTrip[end]][currentTrip[((end+1)%currentTrip.length)]])
                + (distances[currentTrip[start]][currentTrip[end]])
                + (distances[currentTrip[start+1]][currentTrip[((end+1)%currentTrip.length)]]);
    }

    private void uncrossTrip(int start, int end){
        while(start < end) {
            int temp = currentTrip[start];
            currentTrip[start++] = currentTrip[end];
            currentTrip[end--] = temp;
        }
    }

    @Override
    public int[] getTrip(){
        return this.trip;
    }

}