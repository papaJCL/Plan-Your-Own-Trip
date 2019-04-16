import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Application from '../src/components/Application/Application'
import {getOriginalServerPort} from "../src/api/restfulAPI";
import ErrorBanner from '../src/components/Application/ErrorBanner';



function testInitialState() {
    mockConfigResponse();

    const app = shallow(<Application/>);

    let actualConfig = app.state().serverConfig;
    let expectedConfig = null;
    expect(actualConfig).toEqual(expectedConfig);

    let actualOptions = app.state().planOptions;
    let expectedOptions = {
        units: {'miles': 3959 , 'kilometers' : 6371, 'nautical miles' : 3440 },
        activeUnit: 'miles'
    };

    expect(actualOptions).toEqual(expectedOptions);
}

function mockConfigResponse() {
    fetch.mockResponse(JSON.stringify(
        {
            status: 200,
            statusText: 'OK',
            body: {
                'placeAttributes': ["latitude", "longitude", "serverName"],
                'requestType': "config",
                'requestVersion': 1,
                'serverName': "t11"
            },
            type: 'basic',
            url: 'http://localhost:8088/api/config',
            redirected: false,
            ok: true
        }));
}

test("Testing Application's initial state", testInitialState);

function testUpdateOption() {
    const app = shallow(<Application/>);

    app.instance().updatePlanOption("activeUnit", "miles");

    let actualUnit = app.state().planOptions.activeUnit;
    let expectedUnit = "miles";
    expect(actualUnit).toEqual(expectedUnit);
}

test("Testing Application's updatePlanOption function", testUpdateOption);

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
            "places": [],
            "distances": []
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
    showMarkers: [false]

}



function testChangingState(){
    const app = shallow(<Application
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
    />);

    app.instance().updateOldUnit();
    app.update();
    expect(app.state().oldUnits).toEqual('miles')

    app.instance().createErrorBannerState("Error", "400" , "Testing to make sure error is set")
    app.update();
    expect(app.state().errorMessage).toEqual(<ErrorBanner message="Testing to make sure error is set" statusCode="400" statusText="Error" />)

}

test("Tests to make sure state is changed to what it should be " , testChangingState)


function testCreatingApplicationPage(){
    const app = shallow(<Application
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
    />);

    app.instance().createApplicationPage('calc');
    app.instance().createApplicationPage('options');
    app.instance().createApplicationPage('settings');
    app.instance().createApplicationPage('about');
    app.instance().createApplicationPage('sql');
    app.instance().createApplicationPage('');

}

test("Testing if the other pages accept the props arguments " , testCreatingApplicationPage)
