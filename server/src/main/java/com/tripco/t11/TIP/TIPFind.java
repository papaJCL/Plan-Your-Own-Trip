package com.tripco.t11.TIP;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import java.util.ArrayList;
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
    private Map<String, Object>[] narrow;
    private Map<String, Object>[] tempNarrow;
    //logger
    private final transient Logger log = LoggerFactory.getLogger(TIPFind.class);

    public TIPFind(String match, int limit, Map<String, Object>[] narrow){
        this();
        this.match = match;
        this.limit = limit;
        this.narrow = narrow;
    }

    private TIPFind(){
        this.requestType = "find";
        this.requestVersion = 5;
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
        tempNarrow = null;
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
        for(int i = 0; i < placeAttributes.length - 1; ++i){
            matchQuery += placeAttributes[i] + ", ";
        }
        matchQuery += placeAttributes[placeAttributes.length - 1] + " ";
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
        String queryEnd = "\nFROM ( continent ";
        queryEnd += concatMapJoin() + " ) " + concatMatchSearch();
        if(filtersExist()) queryEnd += "\nAND ( " + concatFilterSearch() + ")\n";
        return queryEnd += ") ";
    }

    private String concatMapJoin(){
        String mapJoin = "INNER JOIN country ON continent.id = country.continent "
                + "INNER JOIN region ON country.id = region.iso_country "
                + "INNER JOIN world ON region.id = world.iso_region ";
        return mapJoin;
    }

    private String concatMatchSearch(){
        String matchSearch = "\nWHERE (\n( ( country.name LIKE" + getSearchString(this.match) + ") "
                + "OR ( region.name LIKE" + getSearchString(this.match) + ") "
                + "OR ( world.name LIKE" + getSearchString(this.match) + ") "
                + "OR ( world.municipality LIKE" + getSearchString(this.match) + ") ) ";
        return matchSearch;
    }

    private String getSearchString(String search){
        return " \"%" + search + "%\" ";
    }

    private boolean filtersExist(){
        boolean ret = false;
        if(narrow != null && narrow.length > 0){
            initializeTempNarrow();
            int index = 0;
            for(int i = 0; i < narrow.length; ++i){
                if(((ArrayList<String>)narrow[i].get("values")).size() > 0){
                    ret = true;
                    tempNarrow[index++] = narrow[i];
                }
            }
        }
        return ret;
    }

    private void initializeTempNarrow(){
        int size = 0;
        for(int i = 0; i < narrow.length; ++i){
            if(((ArrayList<String>)narrow[i].get("values")).size() > 0) ++size;
        }
        this.tempNarrow = new Map[size];
    }

    private String concatFilterSearch(){
        String filterSearch = "";
        for(int i = 0; i < tempNarrow.length; ++i){
            filterSearch += (i > 0) ? "AND ( " : " ( ";
            filterSearch += extractFilterSearch(((String)tempNarrow[i].get("name")),
                    (ArrayList<String>)tempNarrow[i].get("values"));
        }
        return filterSearch;
    }

    private String extractFilterSearch(String filter, ArrayList<String> filters){
        String filterMatch = filterMatch(filter);
        String filterSearch = filterMatch + " LIKE";
        for(int j = 0; j < filters.size() - 1; ++j){
            filterSearch += getSearchString(filters.get(j))
                    + "OR " + filterMatch + " LIKE";
        }
        return filterSearch += getSearchString(filters.get(filters.size() - 1)) + " ) ";
    }

    private String filterMatch(String filter){
        String filterMatch = "";
        if(filter.equals("type")){
            filterMatch += "world.type";
        }
        else if(filter.equals("country")){
            filterMatch += "country.name";
        }
        return filterMatch;
    }

    private void addPlaces(ResultSet rsQuery, String[] placeAttributes) throws SQLException{
        initializePlaces();
        int index = 0;
        while(rsQuery.next()){
            Map<String, Object> newPlace = new HashMap<>();
            for(int i = 0; i < placeAttributes.length; ++i){
                newPlace.put(setKey(placeAttributes[i]), rsQuery.getString(placeAttributes[i]));
            }
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

    private String setKey(String key){
        String type = key.substring(0,key.indexOf('.'));
        if(type.equals("world")){
            return key.substring(key.indexOf('.') + 1);
        }
        return type;
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
