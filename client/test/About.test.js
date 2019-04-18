import './enzyme.config.js';
import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import {mount} from 'enzyme';
import About from '../src/components/Application/About/About';
import 'leaflet/dist/leaflet.css';
import Pane from '../src/components/Application/Pane';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';





function testBasicAbout(){
    const about = mount(
        <About />
    );
    let aboutJeremyL = about.instance().createFunction('Jeremy Lesser');
    expect(aboutJeremyL).toEqual(<Pane bodyJSX={<div><Row tag="div"><Col sm={6} tag="div" widths={["xs", "sm", "md", "lg", "xl"]} xs={12}>
        <Col sm={14} tag="div" widths={["xs", "sm", "md", "lg", "xl"]} xs={12}><img src="Stub for static assets" /></Col></Col>
        <Col sm={6} tag="div" widths={["xs", "sm", "md", "lg", "xl"]} xs={12}><Card tag="div">
            <span>I am a fourth year Computer Science Major. I was raised in Erie Colorado. My hobbies include skiing, hiking, and video games.</span>
        </Card></Col></Row></div>} header="Jeremy Lesser" />);

    let aboutHeader = about.instance().createHeader();
    expect(aboutHeader).toEqual(<Pane header={'About us'}
                                      bodyJSX={
                                          <div>
                                              We are a familiy friendly small buisiness trying to make a big impact in the world
                                              of trip management. We hope to change the way you plan trips online and for free!
                                              Below are the members of our team, who are dedicated to making this company a success.
                                          </div>}/>)
    let aboutGilbert = about.instance().getBGilbert();
    expect(aboutGilbert).toEqual(
        <span>
            I am a third year computer science student at CSU. I am an Army ROTC cadet
        and a member of our school secruity club, Hashdump. Born in California and
        raised in Colorado I enjoy skiing, fishing, and playing sports. I am an avid
        reader and play too many video games for my own good.
        </span>
    )
}

test('Double checking validity of our about page', testBasicAbout);