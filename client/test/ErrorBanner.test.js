import './enzyme.config.js';
import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import {mount} from 'enzyme';
import ErrorBanner from '../src/components/Application/ErrorBanner';
import 'leaflet/dist/leaflet.css';
import Pane from '../src/components/Application/Pane';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';
import { Alert } from 'reactstrap';


function testRender(){
    const eBanner = mount(
        <ErrorBanner/>
    );
}

test("Testing ErrorBanner properly" , testRender);