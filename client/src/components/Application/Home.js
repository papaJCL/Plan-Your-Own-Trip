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
        this.reverseList = this.reverseList.bind(this)

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
                createErrorBannerState = {this.props.createErrorBannerState} deleteLocation = {this.deleteLocation}
                sendItineraryRequest = {this.sendItineraryRequest} changeStartLocation = {this.changeStartLocation}
                showMarkers = {this.props.showMarkers} setShowMarkerState = {this.props.setShowMarkerState}
                checkServerResponse= {this.props.checkServerResponse} addLocation = {this.props.addLocation}
                updateLatLongState = {this.props.updateLatLongState} geoBool =  {this.props.geoBool} updateGEOBoolState={this.props.updateGEOBoolState}
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
                reverseList = {this.reverseList}
                liftHomeState = {this.props.liftHomeState}
                boolSQL = {this.props.boolSQL}
                JSONString = {this.props.JSONString}
                setShowMarkerState = {this.props.setShowMarkerState} checkServerResponse ={this.props.checkServerResponse} sendItineraryRequest = {this.sendItineraryRequest}
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
        if (idx >= this.props.JSONString.body.places.length) {
            this.props.createErrorBannerState('Error', '500', 'Attempted to Swap Out of Bounds Index.')
            return;
        }
        let newplaces = this.props.JSONString.body.places;
        let temp = newplaces[idx];
        newplaces[idx] = newplaces[idx0];
        newplaces[idx0] = temp;
        this.props.updatePlacesArray(newplaces);
    }


    changeStartLocation(string) {
        let newplaces = this.props.JSONString.body.places;
        let idx = - 1;
        for (var i = 0; i < newplaces.length; i++) {
            if (newplaces[i].name.toLowerCase().includes(string.toString().toLowerCase())) {
                idx = i;
            }
        }
        if (idx === - 1) {
            alert("Please Enter a Valid Location Name");
            return;
        }
        let temp = newplaces[idx];
        newplaces[idx] = newplaces[0];
        newplaces[0] = temp;
        this.props.updatePlacesArray(newplaces);
    }

    deleteLocation(idx) {
        let places = this.props.JSONString.body.places;
        if (places.length === 2) {
            this.props.createErrorBannerState('Error', '500', `You Must Have At least Two Locations For the Itinerary`);
            return;
        }
        places.splice(idx, 1);
        this.props.markers.splice(idx, 1);
        this.props.showMarkers.splice(idx, 1);
        this.props.updatePlacesArray(places);
    }

    reverseList(){
        var requestString = {
            "requestType"    : "itinerary",
            "requestVersion" : 4,
            "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius))},
            "places"         : this.props.JSONString.body.places.reverse(),
            "distances"      : []
        }
        this.sendItineraryRequest(requestString);
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
