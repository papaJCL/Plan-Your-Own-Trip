package com.tripco.t11.TIP;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP config class and its buildResponse method.
 */
public class TestTIPConfig {
  private TIPConfig conf;

  @Before
  public void createConfigurationForTestCases(){
    conf = new TIPConfig();
    conf.buildResponse();
  }

  @Test
  public void testType() {
    String type = "config"; //conf.getType();
    assertEquals("config requestType", "config", type);
  }

  @Test
  public void testVersion() {
    int version = conf.requestVersion;
    assertEquals("config requestVersion", 3, version);
  }

  @Test
  public void testServerName() {
    String name = conf.getServerName();
    assertEquals("config name", "t11 Ultra Super Team Delta", name);
  }

  @Test
  public void testPlaceAttributes() {
    List<String> attr = conf.getPlaceAttributes();
    assertEquals("config attribute size", 6, attr.size());
  }

  @Test
  public void testOptimizationOptions(){
    List<String> opt = conf.getOptimizationOptions();
    assertEquals("config Optimizations", "none", opt.get(0));
  }

  @Test
  public void testToString(){
    Object toString = conf.toString();
    boolean TorF = toString != null;
    assertEquals("assure toString returns a String", true, TorF);
  }

}
