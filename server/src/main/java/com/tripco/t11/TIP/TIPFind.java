package com.tripco.t11.TIP;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    //logger
    private final transient Logger log = LoggerFactory.getLogger(TIPFind.class);

    public TIPFind(String match, int limit){
        this();
        this.match = match;
        this.limit = limit;
    }

    private TIPFind(){
        this.requestType = "find";
        this.requestVersion = 4;
    }

    @Override
    public void buildResponse(){
        try {
            Class.forName(myDriver);
            try (Connection connect = DriverManager.getConnection(myUrl, user, pass);
                 Statement stCount = connect.createStatement();
                 Statement stQuery = connect.createStatement();
                 ResultSet rsCount = stCount.executeQuery(buildCountQuery());
                 ResultSet rsQuery = stQuery.executeQuery(buildMatchQuery(getPlaceAttributes()));
            )   {
                rsCount.next();
                this.found = rsCount.getInt(1);
                addPlaces(rsQuery, getPlaceAttributes());
            }
        } catch (Exception e) {
            log.error("Exception: " + e.getMessage());
        }
        log.trace("buildResponse -> {}", this);
    }

    private static String[] getPlaceAttributes(){
        String[] placeAttributes = new String[] {"world.name", "world.municipality", "world.latitude", "world.longitude",
                "region.name", "country.name", "continent.name"};
        return placeAttributes;
    }

    private String buildCountQuery(){
        String countQuery = "select count(*) " + queryEnd() + ";";
        return countQuery;
    }

    private String buildMatchQuery(String[] placeAttributes){
        String matchQuery = "SELECT ";
        matchQuery += queryEnd();
        if(limit != null){
            if(limit != 0){
                matchQuery += " limit " + limit;
            }
        }
        matchQuery += ";";
        return matchQuery;
    }

    private String queryEnd(){
        String queryEnd = "FROM continent ";
        queryEnd += "INNER JOIN country ON continent.id = country.continent " +
                "INNER JOIN region ON country.id = region.iso_country " +
                "INNER JOIN world ON region.id = world.iso_region ";
        queryEnd += "WHERE country.name LIKE" + getMatch() +
                "OR region.name LIKE" + getMatch() +
                "OR world.name LIKE" + getMatch() +
                "OR world.municipality LIKE" + getMatch();

        return queryEnd;
    }

    private String getMatch(){
        return " \"%" + this.match + "%\" ";
    }

    private void addPlaces(ResultSet rsQuery, String[] placeAttributes) throws SQLException{
        initializePlaces();
        int index = 0;
        while(rsQuery.next()){
            Map<String, Object> newPlace = new HashMap<>();
            places[index++] = newPlace;
        }
    }

    private void initializePlaces(){
        if(limit != null){
            if(found < limit){
                this.places = new Map[found];
                return;
            }
            else if(limit != 0){
                this.places = new Map[limit];
                return;
            }
        }
        this.places = new Map[found];
    }

    @Override
    public String toString(){
        String ret = "match: " + match + "\n";
        ret += "limit: " + limit.toString() + "\n";
        ret += "found: " + found.toString() + "\n";
        ret += "places:\n";
        for(int i = 0; i < places.length; ++i){
            ret += "\t" + places[i].toString() + "\n";
        }
        return ret;
    }
}
