package com.tripco.t11.misc;


public class TwoOpt extends NearestNeighbor{



        public TwoOpt(Double[][] coords, Double earthRadius){
                super(coords,earthRadius);
        }



        private Long optimizeCurrentStart(int index) {
                Long tripDistance = 0L;
                int placeInTrip = 1;
                while (super.placesAreUnvisited()) {
                        int nextIndex = super.findNextPlace(index);
                        currentTrip[placeInTrip++] = nextIndex;
                        visited[nextIndex] = true;
                        tripDistance += distances[index][nextIndex];
                        index = nextIndex;
                }


                currentTrip = searchForCross(currentTrip , index);

                tripDistance += distances[currentTrip[0]][currentTrip[currentTrip.length - 1]];
                return tripDistance;
        }





        public int[] searchForCross(int[] trip, int startIndex){
                boolean improve = true;
                while (improve) {
                        improve =false;
                        for (int i = 0; i < (trip.length - 3); i++) {

                                for (int k = i + 2; k < trip.length - 1; k++) {

                                        long delta = (-1*distances[trip[i]][trip[i+1]]) + (-1*distances[trip[k]][trip[((k+1)%trip.length)]]) + (distances[trip[i]][trip[k]]) + (distances[trip[i+1]][trip[((k+1)%trip.length)]]);


                                        if (delta < 0) {
                                                trip = uncross(trip, i + 1, k);
                                                        improve = true;
                                        }
                                }
                        }
                }



                return  trip;
        }

        private int[] uncross(int[] route, int i1, int k ){
                while(i1 < k) {
                        int temp = route[i1];
                        route[i1] = route[k];
                        route[k] = temp;
                        i1++;
                        k--;
                }
                return route;
        }

        @Override
        public int[] getTrip(){
                return this.trip;
        }

        @Override
        public void findOptimalTrip(){
                Long bestTotal = Long.MAX_VALUE;
                for(int i = 0; i < distances.length; ++i){
                        super.assignVisited(i);
                        Long currentTotal = optimizeCurrentStart(i);
                        if(currentTotal < bestTotal) {
                                bestTotal = currentTotal;
                                trip = currentTrip.clone();
                        }
                }
        }

}