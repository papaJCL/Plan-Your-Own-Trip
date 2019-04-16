import './enzyme.config.js';
import React from 'react';
import { shallow } from 'enzyme'
import {mount} from 'enzyme';
import Application from '../src/components/Application/Application';
import Itinerary from '../src/components/Application/Itinerary'
import Pane from '../src/components/Application/Pane';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';

import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle , Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Form, Label, Input  } from 'reactstrap';
import BootstrapTable1 from 'react-bootstrap-table-next';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit';


const startProperties = {
    'origUnit': 3959,
    'JSONString' : {"body": {
        "requestType": "itinerary",
        "requestVersion": 2,
        "options": {"title": "defaultJSON", "earthRadius": "3959"},
        "places": [],
        "distances": []
    }
},
    'SQLItineraryInfo' : []

};


function testConvertDistance() {
    const testConvert = mount(<Itinerary
        origUnit = {startProperties.origUnit}
        JSONString = {startProperties.JSONString}
        SQLItineraryInfo = {startProperties.SQLItineraryInfo}
    />);

    let milesNotOrigional = testConvert.instance().convertDistance(10, 'miles', 'kilometers');
    expect(milesNotOrigional).toEqual(6);

    let generalTest = testConvert.instance().convertDistance(10, 'kilometers', 'nautical miles');
    expect(generalTest).toEqual(19);

    let convertOriginalIfNotInMiles = testConvert.instance().convertIfOriginalNotMiles(6371);
    expect(convertOriginalIfNotInMiles).toEqual('kilometers');
}



test('Double checking validity of our distance conversion', testConvertDistance);

const placesStartProperties = {
    'origUnit': 3959,
    'planOptions': {
        units: {'miles':3959 , 'kilometers' : 6371 , 'nautical miles' : 3440},
        activeUnit: 'miles'
    },
    'JSONString': {
        "body": {
            "requestType": "itinerary",
            "requestVersion": 2,
            "options": {"title": "defaultJSON", "earthRadius": "3959"},
            "places": [{ name: "Denver", latitude: "39.7", longitude: "-105.0" },{name: "Fort Collins", latitude: "40.0" , longitude: "70.0"}],
            "distances": [10,15]
        }
    },
    'SQLItineraryInfo': [] ,
    'names' : [],
    'latitude' : [],
    'longitude' : [],
    'activeUnit' : 'miles'
}



    function getTotalDistance(){
    const testConvert = mount(<Itinerary
        origUnit = {placesStartProperties.origUnit}
        JSONString = {placesStartProperties.JSONString}
        SQLItineraryInfo = {placesStartProperties.SQLItineraryInfo}
        names={placesStartProperties.names}
             latitude={placesStartProperties.latitude}
             longitude={placesStartProperties.longitude}
            planOptions={placesStartProperties.planOptions}
    />);
        let totalDistance = testConvert.instance().getTotalDistance(placesStartProperties.JSONString.body.distances);
        expect(totalDistance).toEqual(25)
    }

test('Checking totalDistance', getTotalDistance);

function testTotalItinerary() {
    const basicItinerary = mount(<Itinerary
        origUnit={startProperties.origUnit}
        JSONString={startProperties.JSONString}
        SQLItineraryInfo={startProperties.SQLItineraryInfo}
    />);

    let smallTest = basicItinerary.instance().basicItinerary()
    expect(smallTest).toEqual(<Pane bodyJSX="Your itinerary will load here" header="Itinerary" />
    );
}


test('Checking main render for itinerary', testTotalItinerary);
