package com.tripco.t11.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

import static org.junit.Assert.assertEquals;

public class TestTIPItinerary {

    private Map<String, Object> FoCo;
    private Map<String, Object> Denver;
    private Map<String, Object> Boulder;
    private Vector<Map> places;
    private Map<String, Object> options;
    private final int version = 2;
    private Vector<Long> distances = new Vector<Long>();

    @Before
    public void createLocationsForTestCases() {
        options = new HashMap<>();
        options.put("title", "My Trip");
        options.put("earthRadius", "3958.761316");
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
        places = new Vector<Map>();
        places.add(Denver);
        places.add(Boulder);
        places.add(FoCo);
    }

    @Test
    public void testSingleLocation(){
        Vector<Map> singlePlace = new Vector<Map>();
        singlePlace.add(FoCo);
        TIPItinerary foco = new TIPItinerary(options, singlePlace);
        foco.buildResponse();
        Vector<Long> expect = new Vector<Long>();
        expect.add(0L);
        assertEquals("Single location provides single distance of 0", expect, foco.distances);
    }

    @Test
    public void testNoLocation(){
        Vector<Map> noPlace = new Vector<Map>();
        TIPItinerary noNo = new TIPItinerary(options, noPlace);
        noNo.buildResponse();
        Vector<Long> expect = new Vector<Long>();
        assertEquals("No location provides empty location vector", expect, noNo.distances);
    }

    @Test
    public void testOverWriteDistances(){
        Vector<Long> dist = new Vector<Long>();
        dist.add(100L);
        dist.add(50L);
        dist.add(25L);
        TIPItinerary test = new TIPItinerary(options, places);
        test.buildResponse();
        Vector<Long> expect = new Vector<Long>();
        expect.add(24L);
        expect.add(41L);
        expect.add(59L);
        assertEquals("distances are overwritten with good ones", expect, test.distances);
    }

}
