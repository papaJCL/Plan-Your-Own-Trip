package com.tripco.t11.TIP;

import java.sql.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TIPFind extends TIPHeader {
    //db info
    private final static String myDriver = "com.mysql.jdbc.Driver";
    private final static String myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
    private final static String user = "cs314-db";
    private final static String pass = "eiK5liet1uej";
    //class vars
    private String match;
    private Integer limit;
    private Integer found;
    private Map<String, Object>[] places;


    public TIPFind(String match, int limit){
        this();
        this.match = match;
        this.limit = limit;
    }

    private TIPFind(){
        this.requestType = "find";
        this.requestVersion = 3;
    }

    @Override
    public void buildResponse(){
        TIPConfig config = new TIPConfig();
        config.buildResponse();
        String countQuery = buildCountQuery();
        String matchQuery = buildMatchQuery(config.placeAttributes);
        try {
            Class.forName(myDriver);
            try (Connection connect = DriverManager.getConnection(myUrl, user, pass);
                 Statement stCount = connect.createStatement();
                 Statement stQuery = connect.createStatement();
                 ResultSet rsCount = stCount.executeQuery(countQuery);
                 ResultSet rsQuery = stQuery.executeQuery(matchQuery);
            )   {
                rsCount.next();
                this.found = rsCount.getInt(1);
                initializePlaces();
                addPlaces(rsQuery, config.placeAttributes);
            }
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
    }

    private String buildCountQuery(){
        String countQuery = "select count(*) " + queryEnd() + ";";
        return countQuery;
    }

    private String buildMatchQuery(List<String> attributes){
        String matchQuery = "select ";
        for(int i = 0; i < attributes.size() - 1; ++i){
            matchQuery += attributes.get(i) + ",";
        }
        matchQuery += attributes.get(attributes.size() - 1) + " ";
        matchQuery += queryEnd();
        if(limit != null){
            if(limit != 0){
                matchQuery += " limit " + Integer.toString(limit);
            }
        }
        matchQuery += ";";
        return matchQuery;
    }

    private String queryEnd(){
        String queryEnd = "from colorado where name like '%";
        queryEnd += match + "%' or type like '%";
        queryEnd += match + "%' or municipality like '%";
        queryEnd += match + "%'";
        return queryEnd;
    }

    private void initializePlaces(){
        if(limit != null){
            if(limit != 0){
                this.places = new Map[limit];
            }
        }
        else{
            this.places = new Map[found];
        }
    }

    private void addPlaces(ResultSet rsQuery, List<String> attributes) throws SQLException{
        int j = 0;
        while(rsQuery.next()){
            Map<String, Object> newPlace = new HashMap<>();
            for(int i = 0; i < attributes.size(); ++i){
                newPlace.put(attributes.get(i), rsQuery.getString(attributes.get(i)));
            }
            places[j++] = newPlace;
        }
    }

    @Override
    public String toString(){
        String ret = "match: " + match + "\n";
        ret += "limit: " + limit.toString() + "\n";
        ret += "found: " + found.toString() + "\n";
        ret += "places: " + Arrays.toString(places) + "\n";
        return ret;
    }
}