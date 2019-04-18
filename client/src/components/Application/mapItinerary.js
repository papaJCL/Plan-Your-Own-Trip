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
import {UncontrolledButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ErrorBanner from './ErrorBanner';

export default class mapItinerary extends Component {

    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this);
        this.clearMap = this.clearMap.bind(this)
        this.download = this.download.bind(this)
        this.createAddDropDown = this.createAddDropDown.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleAddSubmit = this.handleAddSubmit.bind(this)
        this.NNButon = this.NNButon.bind(this)
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


    renderIntro(){
        return(
            <Pane header={'Itinerary Menu'}
                  bodyJSX={
                      <div>
                          <span>
                              <Card>
                              <CardBody>
                                <input type="file"name="myFile" onChange={this.onChange}/>
                                <Button onClick={this.clearMap}>Reset Map to default</Button>
                                <Button onClick={this.download}>Download Trip Itinerary</Button>
                                <Button onClick={() => this.props.setShowMarkerState(0)}>Show/Hide All Markers</Button>
                              </CardBody>
                              </Card>
                              {this.createAddDropDown()}
                        </span>
                      </div>
                  }
            />
        );
    }

    handleAddSubmit(event) {
        event.preventDefault();
        //var magellan = require('./../../../../node_modules/magellan-coords/magellan');
        let name = document.getElementById('name').value;
        let lat = document.getElementById('lat').value;
        let long = document.getElementById('long').value;
        // if (magellan(lat).latitude() === null || magellan(long).longitude() === null) {
        //     this.props.createErrorBannerState('Error', '500', 'The Added Location Contains an invalid Latitude or Longitude');
        //     return;
        // }
        this.props.addLocation(name, lat, long);
    }


    createAddDropDown() {
        return (
            <Card>
                <CardBody>
                    <CardTitle><b>Add a New Location</b></CardTitle>
                    <form onSubmit={this.handleAddSubmit}>
                        <input id="name" type="text" placeholder="Enter Name"/>
                        <input id="lat" type="text" placeholder="Enter Latitude"/>
                        <input id="long" type="text" placeholder="Enter Longitude"/>
                        <input type="submit" value="Submit"/>
                    </form>
                    <Button onClick={this.NNButon}>Shorten Trip</Button>
                </CardBody>
            </Card>
        );
    }

    NNButon(){
        console.log("NNButton " , this.props.JSONString.body.places)
        var request = {
            "requestType"    : "itinerary",
            "requestVersion" : 3,
            "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius)) , "optimization":"short"},
            "places"         : this.props.JSONString.body.places,
            "distances"      : []
        };
        sendServerRequestWithBody('itinerary',request,this.props.clientSettings.serverPort)
            .then((response) => {
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'itinerary')
                if(valid) {
                    this.props.liftHomeState(response);
                }
            });
    }
    // code from: https://www.codementor.io/blizzerand/building-forms-using-react-everything-you-need-to-know-iz3eyoq4y
    handleSubmit(e) {
        var request = {
            'requestType':'find',
            'requestVersion': 3,
            'match': this.input.value,
            'limit': 10
        };
        sendServerRequestWithBody('find',request,this.props.clientSettings.serverPort)
            .then((response) => {

                console.log(response)
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'find')
                if(valid){

                    this.props.updateSQLState(response.body);
                }


            });

        e.preventDefault();
    }

    renderMap() {
        return (
            <Pane header={'World Map'}
                  bodyJSX={this.renderLeafletMap()}
            />
        );
    }

    renderLeafletMap() {
        if (this.props.boolMarker == false) {
            return ( this.renderBasicMap());
        }
        else {
            return (this.renderComplexMap());
        }
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



    /*download(jsonData, 'json.txt', 'text/plain');*/
    /*Modified code beloning to Rafał Łużyński on www.stackoverflow.com*/
    download() {
        var content = JSON.stringify(this.props.returnFile);
        var fileName = 'my Trip';
        var contentType = 'text/plain';
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    onChange(event) {
        this.props.clearMapState();
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (event) =>  {
            // The file's text will be printed here
            var inputData = event.target.result
            this.props.sendItineraryRequest(JSON.parse(inputData))

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