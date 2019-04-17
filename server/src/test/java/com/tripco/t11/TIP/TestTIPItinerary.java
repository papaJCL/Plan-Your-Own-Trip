package com.tripco.t11.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TestTIPItinerary {

    private Map<String, Object> FoCo;
    private Map<String, Object> Denver;
    private Map<String, Object> Boulder;
    private Map<String, Object>[] places;
    private Map<String, Object> options;
    private final int version = 3;
    private Long[] distances = new Long[3];

    @Before
    public void createLocationsForTestCases() {
        options = new HashMap<>();
        options.put("title", "My Trip");
        options.put("earthRadius", "3958.761316");
        options.put("optimization", "none");
        Denver = new HashMap<>();
        Denver.put("id", "dnvr");
        Denver.put("name", "Denver");
        Denver.put("latitude", "39.7392");
        Denver.put("longitude", "-104.9903");
        Boulder = new HashMap<>();
        Boulder.put("id", "bldr");
        Boulder.put("name", "Boulder");
        Boulder.put("latitude", "40.01499");
        Boulder.put("longitude", "-105.27055");
        FoCo = new HashMap<>();
        FoCo.put("id", "foco");
        FoCo.put("name", "Denver");
        FoCo.put("latitude", "40.585258");
        FoCo.put("longitude", "-105.084419");
        places = new Map[3];
        places[0] = Denver;
        places[1] = Boulder;
        places[2] = FoCo;
    }

    @Test
    public void testSingleLocation(){
        Map<String, Object>[] singlePlace = new Map[1];
        singlePlace[0] = FoCo;
        TIPItinerary foco = new TIPItinerary(version, options, singlePlace);
        foco.buildResponse();
        Long[] expect = new Long[1];
        expect[0] = 0L;
        assertEquals("Single location provides single distance of 0", expect, foco.distances);
    }

    @Test
    public void testNoLocation(){
        Map<String, Object>[] noPlace = new Map[0];
        TIPItinerary noNo = new TIPItinerary(version, options, noPlace);
        noNo.buildResponse();
        Long[] expect = new Long[0];
        assertEquals("No location provides empty location vector", expect, noNo.distances);
    }

    @Test
    public void testOverWriteDistances(){
        Long[] dist = new Long[3];
        dist[0] = 100L;
        dist[1] = 50L;
        dist[2] = 25L;
        TIPItinerary test = new TIPItinerary(version, options, places);
        test.buildResponse();
        Long[] expect = new Long[3];
        expect[0] = 24L;
        expect[1] = 41L;
        expect[2] = 59L;
        assertEquals("distances are overwritten with good ones", expect, test.distances);
    }

    @Test
    public void testOpt(){
        Map<String, Object>[] trip =  new Map[5];
        options.replace("optimization","short");
        Map<String,Object> origin = new HashMap<>();
        origin.put("latitude","0.0");
        origin.put("longitude","0.0");
        trip[4] = origin;
        Map<String,Object> topLeft = new HashMap<>();
        topLeft.put("latitude","10.0");
        topLeft.put("longitude","-90.0");
        trip[0] = topLeft;
        Map<String,Object> topRight = new HashMap<>();
        topRight.put("latitude","10.0");
        topRight.put("longitude","90.0");
        trip[1] = topRight;
        Map<String,Object> botLeft = new HashMap<>();
        botLeft.put("latitude","-10.0");
        botLeft.put("longitude","-90.0");
        trip[2] = botLeft;
        Map<String,Object> botRight = new HashMap<>();
        botRight.put("latitude","-10.0");
        botRight.put("longitude","90.0");
        trip[3] = botRight;
        TIPItinerary Trip = new TIPItinerary(version, options, trip);
        Trip.buildResponse();

        Map<String,Object>[] expect = new Map[5];
        expect[0] = topLeft;
        expect[4] = botLeft;
        expect[1] = origin;
        expect[2] = topRight;
        expect[3] = botRight;

        assertEquals("optimized trip is computed", expect, Trip.places);
    }

    @Test
    public void testTwoOpt(){
        Map<String, Object>[] trip =  new Map[5];
        options.replace("optimization","short");
        Map<String,Object> topMid = new HashMap<>();
        topMid.put("latitude","30.0");
        topMid.put("longitude","0.0");
        trip[0] = topMid;
        Map<String,Object> topLeft = new HashMap<>();
        topLeft.put("latitude","0.0");
        topLeft.put("longitude","-30.0");
        trip[3] = topLeft;
        Map<String,Object> topRight = new HashMap<>();
        topRight.put("latitude","0.0");
        topRight.put("longitude","30.0");
        trip[2] = topRight;
        Map<String,Object> botLeft = new HashMap<>();
        botLeft.put("latitude","-10.0");
        botLeft.put("longitude","-30.0");
        trip[1] = botLeft;
        Map<String,Object> botRight = new HashMap<>();
        botRight.put("latitude","-10.0");
        botRight.put("longitude","30.0");
        trip[4] = botRight;
        TIPItinerary Trip = new TIPItinerary(version, options, trip);
        Trip.buildResponse();

        Map<String,Object>[] expect = new Map[5];
        expect[4] = topLeft;
        expect[3] = botLeft;
        expect[0] = topMid;
        expect[1] = topRight;
        expect[2] = botRight;

        assertEquals("optimized trip is computed", expect, Trip.places);
    }

    @Test
    public void testToString(){
        TIPItinerary trip = new TIPItinerary(version, options, places);
        Object toString = trip.toString();
        boolean TorF = toString != null;
        assertEquals("assure toString returns a String", true, TorF);
    }

}
