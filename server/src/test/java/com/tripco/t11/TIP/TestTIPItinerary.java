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
        TIPItinerary foco = new TIPItinerary(options, singlePlace);
        foco.buildResponse();
        Long[] expect = new Long[1];
        expect[0] = 0L;
        assertEquals("Single location provides single distance of 0", expect, foco.distances);
    }

    @Test
    public void testNoLocation(){
        Map<String, Object>[] noPlace = new Map[0];
        TIPItinerary noNo = new TIPItinerary(options, noPlace);
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
        TIPItinerary test = new TIPItinerary(options, places);
        test.buildResponse();
        Long[] expect = new Long[3];
        expect[0] = 24L;
        expect[1] = 41L;
        expect[2] = 59L;
        assertEquals("distances are overwritten with good ones", expect, test.distances);
    }

}
