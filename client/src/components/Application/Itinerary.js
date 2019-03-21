import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';


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
        var body = places.map((item, idx) => <Pane header= {'Location ' + (idx + 1) + ': ' + item.name} bodyJSX = {<div>{body}<b>Latitude:</b> {item.latitude}
        <b>Longitude:</b> {item.longitude}  <b>Distance:</b> {item.distance} {this.props.planOptions.activeUnit} <br/> <button onClick={() => this.props.changeStartLocation(idx)}>Make Origin</button>
            <button onClick={() => this.props.deleteLocation(idx)}>Delete</button></div>} />);

        return (
            <Pane header={'Itinerary'}
                  bodyJSX = {
                      <div>{body}
                          <Card style = {footerStyle}>
                              {`  You have  ${numStops}  stops on your trip totalling  ${totalDistance} ${this.props.planOptions.activeUnit}.`}
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
