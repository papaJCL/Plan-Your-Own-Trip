import React, {Component} from 'react';
import 'leaflet/dist/leaflet.css';
import Pane from '../src/components/Application/Pane';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle , Table} from 'reactstrap';
import BootstrapTable1 from 'react-bootstrap-table-next';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
//import {renderBasicMap} from './mapItinerary';
import { mount } from 'enzyme'
import './enzyme.config.js'
import SQL from '../src/components/Application/SQL'
import {getOriginalServerPort, sendServerRequest, sendServerRequestWithBody} from '../src/api/restfulAPI';


const startProperties = {
    'origUnit': 3959,
    'JSONString' : {"body": {
        "requestType": "itinerary",
        "requestVersion": 2,
        "options": {"title": "defaultJSON", "earthRadius": "3959"},
        "places": [{ name: "Denver", latitude: "39.7", longitude: "-105.0" },{name: "Fort Collins", latitude: "40.0" , longitude: "70.0"}],
        "distances": [10,15]
        }
    },
    'clientSettings': {
        'serverPort': getOriginalServerPort()
    },
    'SQLItineraryInfo' : [],
    'SQLJson': [],
    'liftHomeState': () => {},
    'boolSQLFunc': () => {}
};


function testBasic(){
    const basicSQLTest = mount(<SQL
        JSONString = {startProperties.JSONString}
        SQLItineraryInfo = {startProperties.SQLItineraryInfo}
        SQLJson = {startProperties.SQLJson}
        clientSettings = {startProperties.clientSettings}
        liftHomeState = {startProperties.liftHomeState}
        boolSQLFunc = {startProperties.boolSQLFunc}


    />);

    let basicTest = basicSQLTest.find('input').length;
    expect(basicTest).toEqual(3);

    //    let milesNotOrigional = testConvert.instance().convertDistance(10, 'miles', 'kilometers');
    basicSQLTest.instance().sendSQLRequest()
    basicSQLTest.update();
    //basicSQLTest.setProps({ JSONString: startProperties.SQLItineraryInfo.concat(startProperties.JSONString) });

    basicSQLTest.instance().renderSQLTable();

    expect(basicSQLTest.props().JSONString).toEqual(startProperties.JSONString)

    let sanitizeTest = basicSQLTest.instance().sanatizeMatch('xd5a');
    expect(sanitizeTest).toEqual("xd5a")

    basicSQLTest.instance().SQLColumns;








}

test("Basic test " , testBasic)

