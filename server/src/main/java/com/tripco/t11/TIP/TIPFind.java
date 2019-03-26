package com.tripco.t11.TIP;

import java.sql.*;
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
        //String matchQuery = buildMatchQuery(config.placeAttributes);
        try {
            Class.forName(myDriver);
            try (Connection connect = DriverManager.getConnection(myUrl, user, pass);
                 Statement stCount = connect.createStatement();
                 //Statement stQuery = connect.createStatement();
                 ResultSet rsCount = stCount.executeQuery(countQuery);
                 //ResultSet rsQuery = stQuery.executeQuery(matchQuery);
            )   {

            }
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
    }

    private String buildCountQuery(){
        String countQuery = "select count(*) " + queryEnd() + ";";
        return countQuery;
    }

    private String buildMatchQuery(){
        return "";
    }

    private String queryEnd(){
        String queryEnd = "from colorado where name like '%";
        queryEnd += match + "%' or type like '%";
        queryEnd += match + "%' or municipality like '%";
        queryEnd += match + "%'";
        return queryEnd;
    }

    @Override
    public String toString(){
        return "";
    }
}
