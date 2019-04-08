package com.tripco.t11.misc;


public class TwoOpt extends NearestNeighbor{



        public TwoOpt(Double[][] coords, Double earthRadius){
                super(coords,earthRadius);
        }



        @ Override
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
                int[] tripToOptimise = currentTrip;
                int[] optimisedTrip;

                optimisedTrip = searchForCross(tripToOptimise , index);

                tripDistance += distances[optimisedTrip[0]][optimisedTrip[optimisedTrip.length - 1]];
                return tripDistance;
        }




        public int[] searchForCross(int[] trip, int startIndex){

                boolean improve = true;
                while (improve) {
                        improve =false;
                        for (i = 0; i < trip.length - 3; i++) {

                                for (k = i + 2; k < trip.length - 1; k++) {

                                        int delta = (-1*distances[i][i+1]) + (-1*distances[k][k+1]) + (distances[i][k]) + (distances[i+1][k+1]);


                                        if (delta < 0) {
                                                uncross(trip, i + 1, k)
                                                        improve = true;
                                        }
                                }
                        }
                }



                return  trip;
        }

        private int[] uncross(route[], int i1, int k ){
                while(i1 < k) {
                        int temp = route[i1];
                        route[i1] = route[k];
                        route[k] = temp;
                        i1++;
                        k--;
                }
                return route;
        }

}