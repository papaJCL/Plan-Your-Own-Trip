import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';
import Itinerary from './Itinerary'
import MapItinerary from './mapItinerary'


import { getOriginalServerPort, sendServerRequestWithBody } from '../../api/restfulAPI'



//The code to read a file was from https://developer.mozilla.org/pt-BR/docs/Web/API/FileReader/onload

/*
 * Renders the home page.
 */
export default class Home extends Component {

    constructor(props) {
        super(props)
        this.sendItineraryRequest = this.sendItineraryRequest.bind(this)
        this.deleteLocation = this.deleteLocation.bind(this)
        this.changeStartLocation = this.changeStartLocation.bind(this)
        this.changeOrder = this.changeOrder.bind(this)
        this.reRenderNewMap = this.reRenderNewMap.bind(this)
    }

    callMapItinerary(){
        return (
            <MapItinerary
                clientSettings = {this.props.clientSettings}
                clearMapState = {this.props.clearMapState}
                reRenderNewMapState = {this.props.reRenderNewMapState}
                markers = {this.props.markers}
                JSONString = {this.props.JSONString}
                returnFile = {this.props.returnFile}
                latitude = {this.props.latitude}
                longitude = {this.props.longitude}
                boolMarker = {this.props.boolMarker}
                polyLineCoor = {this.props.polyLineCoor}
                names = {this.props.names}
                liftHomeState = {this.props.liftHomeState}
                updatePlacesArray = {this.props.updatePlacesArray}
                deleteError = {this.props.deleteError}
                deleteLocation = {this.deleteLocation}
                sendItineraryRequest = {this.sendItineraryRequest}
                changeStartLocation = {this.changeStartLocation}
                ref="child"
            />
        )
    }

    callItinerary(){
        return (
            <Itinerary
                boolMarker = {this.props.boolMarker}
                JSONString = {this.props.JSONString}
                changeStartLocation = {this.changeStartLocation}
                deleteLocation = {this.deleteLocation}
                changeOrder = {this.changeOrder}
                planOptions = {this.props.planOptions}
                oldUnits = {this.props.oldUnits}
                origUnit = {this.props.origUnit}
                latitude = {this.props.latitude}
                longitude = {this.props.longitude}
                names = {this.props.names}
                filterID = {this.props.filterID}
                filterName = {this.props.filterName}
                filterLat = {this.props.filterLat}
                filterLong = {this.props.filterLong}
                filterDist = {this.props.filterDist}
                renderFilterID = {this.props.renderFilterID}
                renderFilterName = {this.props.renderFilterName}
                renderFilterLatitude = {this.props.renderFilterLatitude}
                renderFilterLongitude = {this.props.renderFilterLongitude}
                renderFilterDistance = {this.props.renderFilterDistance}
            />
        )
    }

    render() {
        return (
            <Container>
                {this.callMapItinerary()}
                {this.callItinerary()}
            </Container>
        );
    }

    changeOrder(idx0, idx) {
        let newplaces = this.props.JSONString.body.places;
        let temp = newplaces[idx];
        newplaces[idx] = newplaces[idx0];
        newplaces[idx0] = temp;
        this.props.updatePlacesArray(newplaces);
    }


    changeStartLocation(idx) {
        let places = this.props.JSONString.body.places;
        let newplaces = [];
        for (var i = 0; i < places.length; i++) {
            newplaces[i] = places[(idx + i) % places.length];
        }
        this.props.updatePlacesArray(newplaces);
    }

    deleteLocation(idx) {
        let places = this.props.JSONString.body.places;
        if (places.length === 2) {
            this.props.deleteError();
            return;
        }
        places.splice(idx, 1);
        this.props.updatePlacesArray(places);
    }


    sendItineraryRequest(requestBody) {

        sendServerRequestWithBody('itinerary', requestBody, this.props.clientSettings.serverPort)
            .then((response) => {
                this.props.liftHomeState(response);
            });
    }

    reRenderNewMap(){
        let places = this.props.JSONString.body.places
        const mappingFunction = p => p.latitude;
        const mappingFunction1 = p => p.longitude;
        const mappingFunction2 = p => p.name;

        const latitude = places.map(mappingFunction)
        const longitude = places.map(mappingFunction1)
        const names = places.map(mappingFunction2)

        var markers = [[]]
        var polyLine = [[]]

        for (var i = 0; i < latitude.length; i++){
            var hold = []
            hold.push(latitude[i])
            hold.push(longitude[i])
            markers.push(hold)
        }

        markers.shift()
        polyLine = markers.slice(0)
        polyLine.push(markers[0])

        this.props.reRenderNewMapState(latitude, longitude, names, polyLine, markers)
    }



}
