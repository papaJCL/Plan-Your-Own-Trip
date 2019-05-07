import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { sendServerRequestWithBody } from '../../api/restfulAPI'
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';
import { Dropdown, DropdownItem, DropdownButton} from 'react-bootstrap';
import ErrorBanner from './ErrorBanner';

export default class mapItinerary extends Component {

    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this);
        this.clearMap = this.clearMap.bind(this)
        this.algorithmButton = this.algorithmButton.bind(this);
    }

    render(){
        return(
            <Row>
                <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                    {this.renderMap()}
                </Col>
                <Col xs={12} sm={12} md={5} lg={4} xl={3}>
                    {this.renderIntro()}
                </Col>

            </Row>
        )
    }

    optionsDropDown() {
        return (
            <DropdownButton size="sm" variant="Secondary" id="dropdown-basic-button" title="Options" caret>
                <Dropdown.Item onClick={this.clearMap}>Reset Map to Default</Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.setShowMarkerState(0)}>Show/Hide All Markers</Dropdown.Item>
            </DropdownButton>
        );
    }

    shortenDropDown() {
       return (
           <DropdownButton size="sm" variant="Secondary" id="dropdown-basic-button" title="Shorten Trip" caret>
               <Dropdown.Item onClick={() => this.algorithmButton('short')}>Short Trip</Dropdown.Item>
               <Dropdown.Item onClick={() => this.algorithmButton('shorter')}>Shorter Trip</Dropdown.Item>
           </DropdownButton>
       );
    }

    renderIntro(){
        return(
            <Pane header={'Itinerary Menu'}
                  bodyJSX={
                      <div>
                          <span>
                              <Card>
                              <CardBody>
                                <Row>
                                <input type="file"name="myFile" onChange={this.onChange}/>
                                {this.optionsDropDown()}
                                </Row>
                                <Row>
                                    {this.shortenDropDown()}
                                </Row>
                                </CardBody>
                              </Card>
                        </span>
                      </div>
                  }
            />
        );
    }

    algorithmButton(shortType){
        var request = {
            "requestType"    : "itinerary",
            "requestVersion" : 3,
            "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius)) , "optimization": shortType},
            "places"         : this.props.JSONString.body.places,
            "distances"      : []
        };
        sendServerRequestWithBody('itinerary',request,this.props.clientSettings.serverPort)
            .then((response) => {
                console.log(response)
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'itinerary')
                if(valid){
                    this.props.liftHomeState(response);
                }
            });
    }

    renderMap() {
        return (
            <Pane header={'World Map'}
                  bodyJSX={this.renderLeafletMap()}
            />
        );
    }

    renderLeafletMap() {
        if ((this.props.boolMarker == false) || (this.props.JSONString.body.places.length < 1)) {
            return ( this.renderBasicMap());
        }
        else if (this.props.JSONString.body.places.length <2){
            return (this.renderSingleLocation());
        }
        else {
            return (this.renderComplexMap());
        }
    }

    renderSingleLocation(){
        return(
            <div>
                <Map center={[this.props.latitude[0],this.props.longitude[0]]} zoom={10} animate = {true}
                     style={{height: 500, maxwidth: 700}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={[this.props.latitude[0],this.props.longitude[0]]}
                            icon={this.markerIcon()}>
                        <Popup><div align="center"><b>Location: 1: </b><br />{this.props.JSONString.body.places[0].name}<br />{parseFloat(this.props.JSONString.body.places[0].latitude).toFixed(5)}, {parseFloat(this.props.JSONString.body.places[0].longitude).toFixed(5)}</div></Popup>
                    </Marker>
                </Map>
            </div>
        );
    }

    renderBasicMap(){
        return(
            <div>
                <Map center={[0,0]} zoom={2}
                     style={{height: 500, maxwidth: 700}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                </Map>
            </div>
        );
    }

    renderComplexMap(){
        return (
            <div>
                <Map bounds = {this.props.markers} animate = {true}
                     style={{height: 500, maxwidth: 700}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Polyline
                        positions ={this.props.polyLineCoor}
                        color = {'black'}
                        weight = {5}
                        opacity = {0.5}
                        smoothFactor = {1}
                    />
                    {
                        this.renderMarkers()
                    }

                </Map>
            </div>

        );
    }

    renderMarkers() {
        return (
            <div>
                {
                    this.props.markers.map((position, idx) =>
                        (this.props.showMarkers[idx + 1]) ?
                        <Marker key={`marker-${idx}`} position={position} icon={this.markerIcon()}>
                            <Popup><div align="center"><b>Location {idx + 1}: </b><br />{this.props.JSONString.body.places[idx].name}<br />{parseFloat(this.props.JSONString.body.places[idx].latitude).toFixed(5)}, {parseFloat(this.props.JSONString.body.places[idx].longitude).toFixed(5)}</div></Popup>
                        </Marker> : (null)
                    )}
            </div>
        );
    }

    parseCoords(json) {
        var Coordinates = require('coordinate-parser');
        for (let i = 0; i < json.places.length; i++) {
            try {
                let coords = new Coordinates(json.places[i].latitude + ' ' + json.places[i].longitude);
                json.places[i].latitude = coords.getLatitude() + '';
                json.places[i].longitude = coords.getLongitude() + '';
            }
            catch (error) {
                this.props.createErrorBannerState("Error", '500', "Invalid Coordinates Detected in Itinerary");
            }
        }
        return json;
    }

    onChange(event) {
        this.props.clearMapState();
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (event) =>  {
            // The file's text will be printed here
            var inputData = event.target.result
            try {
                let json = JSON.parse(inputData);
                json = this.parseCoords(json);
                console.log(json)
                this.props.sendItineraryRequest(json)
            }
            catch (error) {
                this.props.createErrorBannerState("Error", "500", "Problem Parsing Itinerary File ( " + error.message + ")");
                return;
            }

        };
        reader.readAsText(file);
        event.target.value = null;
    }

    markerIcon() {
        // react-leaflet does not currently handle default marker icons correctly,
        // so we must create our own
        return L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }


    clearMap(){
        this.props.clearMapState();
    }

}