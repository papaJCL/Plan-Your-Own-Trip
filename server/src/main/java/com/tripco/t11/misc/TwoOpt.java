package com.tripco.t11.misc;


public class TwoOpt extends NearestNeighbor{



        public TwoOpt(Double[][] coords, Double earthRadius){
                super(coords,earthRadius);
        }



        private Long optimizeCurrentStart(int index) {
                System.out.println("in 2opt optimize start");
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
                System.out.println("in search for cross");
                boolean improve = true;
                while (improve) {
                        improve =false;
                        System.out.println("trip length " + trip.length);
                        for (int i = 0; i < (trip.length - 3); i++) {

                                for (int k = i + 2; k < trip.length - 1; k++) {

                                        long delta = (-1*distances[i][i+1]) + (-1*distances[k][((k+1)%trip.length)]) + (distances[i][k]) + (distances[i+1][((k+1)%trip.length)]);


                                        if (delta < 0) {
                                                System.out.println("Delta = " + delta);
                                                System.out.println("i+1  " + i+1 + " k " + k);
                                                trip = uncross(trip, i + 1, k);
                                                        improve = true;
                                        }
                                }
                        }
                }



                return  trip;
        }

        private int[] uncross(int[] route, int i1, int k ){
                System.out.println("in uncross");
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