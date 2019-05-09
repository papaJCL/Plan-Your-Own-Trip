import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { sendServerRequestWithBody } from '../../api/restfulAPI'
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, CardHeader } from 'reactstrap';
import { Dropdown, DropdownItem, DropdownButton} from 'react-bootstrap';
import ErrorBanner from './ErrorBanner';
import {Input, CustomInput, FormGroup, Label} from 'reactstrap';

export default class mapItinerary extends Component {

    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this);
        this.clearMap = this.clearMap.bind(this)
        this.algorithmButton = this.algorithmButton.bind(this);
        this.getUserLocation =this.getUserLocation.bind(this);
    }

    render(){
        return(
            <Row>
                <Col xs={18} sm={18} md={10} lg={12} xl={12}>
                    {this.renderMap()}
                    <FormGroup>
                        <CustomInput type="file" id="FileBrowser" name="File" label="Upload Itinerary" onChange={this.onChange} />
                    </FormGroup>
                </Col>
            </Row>
        )
    }

    optionsDropDown() {
        return (
            <DropdownButton size="sm" variant="Secondary" id="dropdown-basic-button" title="Map Menu" caret>
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
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'itinerary')
                if(valid){
                    this.props.liftHomeState(response);
                }
            });
    }

    renderMap() {
        return (
            <Card>
                <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
                    World Map
                </CardHeader>
                <CardBody>
                    {this.renderLeafletMap()}
                    <Col>
                        <Row>
                            {this.optionsDropDown()}
                            {this.shortenDropDown()}
                        </Row>
                    </Col>
                </CardBody>
            </Card>
        );
    }

    renderLeafletMap() {
        if(this.props.geoBool == false){
            return( this.getUserLocation());

        } else if ((this.props.boolMarker == false)||(this.props.JSONString.body.places.length == 0)) {
            return ( this.renderBasicMap());

        } else if (this.props.JSONString.body.places.length ==1) {
            return (this.renderSingleLocation());

        } else {
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


     // code from https://hackernoon.com/react-native-basics-geolocation-adf3c0d10112
    getUserLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    var requestAll = {
                        "requestType"    : "itinerary",
                        "requestVersion" : 4,
                        "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius))},
                        "places"         : [ { name:"Your Location", latitude: String(position.coords.latitude), longitude: String(position.coords.longitude),id:"0"}],
                        "distances"      : [0]
                    }
                    sendServerRequestWithBody('itinerary',requestAll,this.props.clientSettings.serverPort)
                        .then((response) => {
                            this.props.liftHomeState(response);
                        });
                },(error) => {
                    this.props.updateGEOBoolState();
                }
        );
        }
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