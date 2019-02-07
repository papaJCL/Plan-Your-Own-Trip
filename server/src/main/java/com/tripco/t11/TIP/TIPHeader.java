package com.tripco.t11.TIP;

public abstract class TIPHeader {
  protected Integer requestVersion;
  protected String requestType;
  public abstract String toString();

  public abstract void buildResponse();
}
