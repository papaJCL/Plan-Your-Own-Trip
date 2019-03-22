import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';

import Calculator from './Calculator/Calculator'
//import Table from 'react-bootstrap/Table'




export default class Iitnerary extends Component {

    constructor(props) {
        super(props)
        this.renderItinerary = this.renderItinerary.bind(this)
        this.basicItinerary = this.basicItinerary.bind(this)
    }

    render(){
        return(
            <Row>
                {this.props.boolMarker ?(
                    <Col xs={12}>
                        {this.renderItinerary()}
                    </Col>
                ) : (
                    <Col xs={12}>
                        {this.basicItinerary()}
                    </Col>
                )}
            </Row>
        )
    }

    convertUnitsToNum(unit){
        if (unit == 'miles'){return 3959}
        if (unit == 'kilometers'){return 6371}
        if (unit == 'nautical miles'){return 3440}
    }

    convertIfOriginalNotMiles(oldUnit){
        if (oldUnit == 6371){ return 'kilometers'}
        if (oldUnit == 3440){ return 'nautical miles'}
    }

    convertDistance(distance, activeUnit, oldUnit){
        console.log("origUnit is " , this.props.origUnit)
        console.log("old unit is " , oldUnit)
        console.log("active unit is" , activeUnit)
        if (oldUnit == '' && this.props.origUnit != 3959){
            oldUnit = this.convertIfOriginalNotMiles(this.props.origUnit)
        }
        else if (oldUnit == ''){ return distance }
        else if (this.props.origUnit != 3959){
            oldUnit = this.convertIfOriginalNotMiles(this.props.origUnit)
            console.log("land here")
        }
        let newDistance = distance
        let numOldUnit = this.convertUnitsToNum(oldUnit)
        let numNewUnit = this.convertUnitsToNum(activeUnit)
        newDistance = distance * (numNewUnit/numOldUnit)
        newDistance = Math.round(newDistance)
        return newDistance
    }

    renderItinerary(){
        var footerStyle = {
            backgroundColor: 'grey',
            alignSelf: 'center',
            color: 'white'
        };

        let places = this.props.JSONString.body.places
        let distanceArray = this.props.JSONString.body.distances

        for (var i = 0; i < places.length; i++){
            places[i].distance = distanceArray[i]
        }

        var totalDistance =0
        for (var i = 0; i < places.length; i++) {
            totalDistance = distanceArray[i] + totalDistance
        }
        var numStops = places.length

        let distances = this.props.JSONString.body.distances
        var body = places.map((item, idx) => <Pane header= {'Location ' + (idx + 1) + ': ' + item.name} bodyJSX = {<div>{body}<b>Latitude:</b> {item.latitude}<br/>
        <b>Longitude:</b> {item.longitude} <br/>  <b>Distance: </b> {this.convertDistance(item.distance, this.props.planOptions.activeUnit, this.props.oldUnits )} {' '}
        {this.props.planOptions.activeUnit} <br/> <button onClick={() => this.props.changeStartLocation(idx)}>Make Origin</button>
            <button onClick={() => this.props.deleteLocation(idx)}>Delete</button></div>} />);

        return (
            <Pane header={'Itinerary'}
                  bodyJSX = {
                      <div>{body}
                          <Card style = {footerStyle}>
                              {`  You have  ${numStops}  stops on your trip totalling  ${this.convertDistance(totalDistance, this.props.planOptions.activeUnit, this.props.oldUnits )} ${this.props.planOptions.activeUnit}.`}
                          </Card>
                      </div>
                  }
            />
        );
    }

    basicItinerary() {
        return (
            <Pane header={'Itinerary'}
                  bodyJSX={'Your itinerary will load here'}/>
        );
    }

}
