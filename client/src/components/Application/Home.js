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
        this.addLocation = this.addLocation.bind(this)
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
                createErrorBannerState = {this.props.createErrorBannerState}
                deleteLocation = {this.deleteLocation}
                addLocation = {this.addLocation}
                sendItineraryRequest = {this.sendItineraryRequest}
                changeStartLocation = {this.changeStartLocation}
                showMarkers = {this.props.showMarkers}
                setShowMarkerState = {this.props.setShowMarkerState}
                ref="child"
            />
        )
    }

    callItinerary(){
        return (<Itinerary
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
                liftHomeState = {this.props.liftHomeState}
                boolSQL = {this.props.boolSQL}
                JSONString = {this.props.JSONString}/>)
    }

    render() {
        return (
            <Container>
                {this.callMapItinerary()}
                {this.callItinerary()}
            </Container>
        );
    }

    addLocation(name, lat, long) {
        var magellan = require('./../../../../node_modules/magellan-coords/magellan');
        if (magellan(lat).latitude() === null || magellan(long).longitude() === null) {
            this.props.createErrorBannerState('Error', '500', 'Invalid Latitude or Longitude Entered Into Add a New Location');
            return;
        }
        if ((lat.includes('N') || lat.includes('W') || lat.includes('E') || lat.includes('S') || lat.includes('°'))) {
            lat = magellan(lat).latitude().toDD();
        }
        if ((long.includes('N') || long.includes('W') || long.includes('E') || long.includes('S') || long.includes('°'))) {
            long = magellan(long).longitude().toDD();
        }
        let newplaces = this.props.JSONString.body.places;
        let newloc = {"name": name, "latitude": lat, "longitude": long, "id": "" + this.props.JSONString.body.places.length};
        newplaces.push(newloc);
        this.props.updatePlacesArray(newplaces);

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
            this.props.createErrorBannerState('Error', '500', `You Must Have At least Two Locations For the Itinerary`);
            return;
        }
        places.splice(idx, 1);
        (this.props.markers).splice(idx, 1);
        this.props.updatePlacesArray(places);
    }


    sendItineraryRequest(requestBody) {
        console.log("Request body is " , requestBody)
        sendServerRequestWithBody('itinerary', requestBody, this.props.clientSettings.serverPort)
            .then((response) => {
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'itinerary')
                if(valid){

                    this.props.liftHomeState(response);
                }
            });
    }
}
