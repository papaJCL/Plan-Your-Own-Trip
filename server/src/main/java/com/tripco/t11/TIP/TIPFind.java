package com.tripco.t11.TIP;

import java.sql.*;
import java.util.Map;

public class TIPFind extends TIPHeader {
    //db info
    private final static String myDriver = "com.mysql.jdbc.Driver";
    private final static String myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
    private final static String user = "cs314-db";
    private final static String pass = "eiK5liet1uej";

    private final static String count = "";
    private final static String search = "";
    //class vars
    private String match;
    private Long limit;
    private Long found;
    private Map<String, Object>[] places;


    public TIPFind(int version, String match, Long limit){
        this();
        this.requestVersion = version;
        this.match = match;
        this.limit = limit;
    }

    private TIPFind(){ this.requestType = "find"; }

    @Override
    public void buildResponse(){
        try {
            Class.forName(myDriver);
            try (Connection connect = DriverManager.getConnection(myUrl, user, pass);
                Statement stCount = connect.createStatement();
                Statement stQuery = connect.createStatement();
                ResultSet rsCount = stCount.executeQuery(count);
                ResultSet rsQuery = stQuery.executeQuery(search);
            )   {
                printJSON(rsCount, rsQuery);
            }

        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
    }

    private static void printJSON(ResultSet count, ResultSet query) throws SQLException {
        System.out.printf("\n{\n");
        System.out.printf("\"type\": \"find\",\n");
        System.out.printf("\"title\": \"%s\",\n",search);
        System.out.printf("\"places\": [\n");

        count.next();
        int results = count.getInt(1);

        while(count.next()){
            System.out.printf(" \"%s\"", query.getString("code"));
            if(--results == 0)
                System.out.printf("\n");
            else
                System.out.printf(",\n");
        }
        System.out.printf(" ]\n}\n");
    }

    @Override
    public String toString(){
        return "";
    }
}
