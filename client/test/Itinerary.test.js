import './enzyme.config.js';
import React from 'react';
import { shallow } from 'enzyme'
import {mount} from 'enzyme';
import Application from '../src/components/Application/Application';
import Itinerary from '../src/components/Application/Itinerary'

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

};


function testConvertDistance() {
    const testConvert = mount(<Itinerary
        origUnit = {startProperties.origUnit}
    />);

    let milesNotOrigional = testConvert.instance().convertDistance(10, 'miles', 'kilometers');
    expect(milesNotOrigional).toEqual(6);

    let generalTest = testConvert.instance().convertDistance(10, 'kilometers', 'nautical miles');
    expect(generalTest).toEqual(19)
}



test('Double checking validity of our distance conversion', testConvertDistance);

/*
function testTotalDistance(){
    const testTotal = mount(<Itinerary
        JSONString = {startProperties.JSONString}
    />);
    let actualTotal = testTotal.instance().getTotalDistance([{"id":"dnvr", "name":"Denver",       "latitude": "39.7392",   "longitude": "-104.9903"},
        {"id":"bldr", "name":"Boulder",      "latitude": "40.01499",  "longitude": "-105.27055"},
        {"id":"foco", "name":"Fort Collins", "latitude": "40.585258", "longitude": "-105.084419"}])
    expect (actualTotal).toEqual(139)


}

test('Making sure the itinerary boxes render', testTotalDistance);
*/