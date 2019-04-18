import './enzyme.config.js';
import React, {Component} from 'react';
import {mount} from 'enzyme';
import Pane from '../src/components/Application/Pane';
import Home from '../src/components/Application/Home'
import 'leaflet/dist/leaflet.css';
import {getOriginalServerPort, sendServerRequestWithBody} from "../src/api/restfulAPI";


const finalStartProperties = {
    serverConfig: null,
    planOptions: {
        units: {'miles':3959 , 'kilometers' : 6371 , 'nautical miles' : 3440},
        activeUnit: 'miles'
    },
    clientSettings: {
        serverPort: getOriginalServerPort()
    },
    origin: {latitude: '', longitude: ''},
    destination: {latitude: '', longitude: ''},
    distance: 0,
    errorMessage: null,
    JSONString: {
        "body": {
            "requestType": "itinerary",
            "requestVersion": 2,
            "options": {"title": "defaultJSON", "earthRadius": "3959"},
            "places" : [{"name":"Denver",       "latitude": "39.7", "longitude": "-105.0"}],
            "distances": [15,20]
        }
    },
    returnFile: [],
    latitude: [],
    longitude: [],
    markers: [[]],
    boolMarker: false ,
    polyLineCoor: [[]],
    names : [] ,
    oldUnits : '',
    origUnit: '',
    filterID: true,
    filterName: false,
    filterLat: false,
    filterLong: false,
    filterDist: false,
    SQLJson: [] ,
    SQLItineraryInfo: [],
    boolSQL: true,
    showMarkers: [false] ,
    'updatePlacesArray': () => {},
    'createErrorBannerState': () => {},


};


function testBasicCompileForChildrenComponents(){
    const home = mount(<Home
        serverConfig = {finalStartProperties.serverConfig}
        planOptions = {finalStartProperties.planOptions}
        clientSettings = {finalStartProperties.clientSettings}
        origin = {finalStartProperties.origin}
        destination = {finalStartProperties.destination}
        distance = {finalStartProperties.distance}
        errorMessage = {finalStartProperties.errorMessage}
        JSONString = {finalStartProperties.JSONString}
        returnFile = {finalStartProperties.returnFile}
        latitude = {finalStartProperties.latitude}
        longitude = {finalStartProperties.longitude}
        markers = {finalStartProperties.markers}
        boolMarker = {finalStartProperties.boolMarker}
        polyLineCoor = {finalStartProperties.polyLineCoor}
        names = {finalStartProperties.names}
        oldUnits = {finalStartProperties.oldUnits}
        originUnit = {finalStartProperties.origUnit}
        filterID = {finalStartProperties.filterID}
        filterName = {finalStartProperties.filterName}
        filterLat = {finalStartProperties.filterLat}
        filterLong = {finalStartProperties.filterLong}
        filterDist = {finalStartProperties.filterDist}
        SQLJson = {finalStartProperties.SQLJson}
        SQLItineraryInfo = {finalStartProperties.SQLItineraryInfo}
        boolSQL = {finalStartProperties.boolSQL}
        showMarkers = {finalStartProperties.showMarkers}
        settings={finalStartProperties.clientSettings}
        updatePlacesArray = {finalStartProperties.updatePlacesArray}
        createErrorBannerState = {finalStartProperties.createErrorBannerState}
    />);

    home.setState({JSONString: finalStartProperties.JSONString});
    home.instance().callMapItinerary();
    home.instance().callItinerary();
    home.instance().changeOrder(1,2);
    home.update();
    expect(home.state().JSONString.body.distances).toEqual([15,20])
    home.instance().changeStartLocation(1);
    home.update();
    expect(home.state().JSONString.body.distances).toEqual([15,20])
    home.instance().deleteLocation(1);
    home.update();
    expect(home.state().JSONString.body.distances).toEqual([15,20])
}

test("Basic Render Test for Home" , testBasicCompileForChildrenComponents)


function testRender(){
    const home = mount(<Home
        serverConfig = {finalStartProperties.serverConfig}
        planOptions = {finalStartProperties.planOptions}
        clientSettings = {finalStartProperties.clientSettings}
        origin = {finalStartProperties.origin}
        destination = {finalStartProperties.destination}
        distance = {finalStartProperties.distance}
        errorMessage = {finalStartProperties.errorMessage}
        JSONString = {finalStartProperties.JSONString}
        returnFile = {finalStartProperties.returnFile}
        latitude = {finalStartProperties.latitude}
        longitude = {finalStartProperties.longitude}
        markers = {finalStartProperties.markers}
        boolMarker = {finalStartProperties.boolMarker}
        polyLineCoor = {finalStartProperties.polyLineCoor}
        names = {finalStartProperties.names}
        oldUnits = {finalStartProperties.oldUnits}
        originUnit = {finalStartProperties.origUnit}
        filterID = {finalStartProperties.filterID}
        filterName = {finalStartProperties.filterName}
        filterLat = {finalStartProperties.filterLat}
        filterLong = {finalStartProperties.filterLong}
        filterDist = {finalStartProperties.filterDist}
        SQLJson = {finalStartProperties.SQLJson}
        SQLItineraryInfo = {finalStartProperties.SQLItineraryInfo}
        boolSQL = {finalStartProperties.boolSQL}
        showMarkers = {finalStartProperties.showMarkers}
        settings={finalStartProperties.clientSettings}
        updatePlacesArray = {finalStartProperties.updatePlacesArray}
    />);
    let numberOfInputs = home.find('Container').length;
    expect(numberOfInputs).toEqual(2)
}