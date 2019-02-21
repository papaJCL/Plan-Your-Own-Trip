package com.tripco.t11.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP distance class and its buildResponse method.
 */
public class TestTIPDistance {

  /* Radius and location values shared by test cases */
  private final float radiusMiles = 3958;
  private final float radiusMeters = 6371400;
  private Map<String, Object> csu;
  private Map<String, Object> syd;
  private final int version = 1;

  @Before
  public void createLocationsForTestCases() {
    csu = new HashMap<>();
    csu.put("latitude", "40.576179");
    csu.put("longitude", "-105.080773");
    csu.put("name", "Oval, Colorado State University, Fort Collins, Colorado, USA");
    syd = new HashMap<>();
    syd.put("latitude", "-33.8568");
    syd.put("longitude", "151.2153");
    syd.put("name", "Opera House, Sydney, Australia");
  }

  @Test
  public void testOriginDestinationSame() {
    TIPDistance trip = new TIPDistance(version, csu, csu, radiusMiles);
    trip.buildResponse();
    Long expect = 0L;
    Long actual = trip.getDistance();
    assertEquals("origin and destination are the same", expect, actual);
  }

  @Test
  public void testLongDistance(){
    TIPDistance trip = new TIPDistance(version, csu, syd, radiusMeters);
    trip.buildResponse();
    Long expect = 13431L;
    Long actual = trip.getDistance()/1000L;
    assertEquals("Distances work for large radius values", expect, actual);
  }
}
