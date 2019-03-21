package com.tripco.t11.TIP;

import java.util.Map;

public class TIPFind extends TIPHeader {

    private String match;
    private Long limit;
    private Long found;
    private Map<String, Object>[] places;

    public TIPFind(String match, Long limit){
        this.match = match;
        this.limit = limit;
    }

    @Override
    public void buildResponse(){
        return;
    }

    @Override
    public String toString(){
        return "";
    }
}
