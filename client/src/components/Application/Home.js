import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';


import { getOriginalServerPort, sendServerRequestWithBody } from '../../api/restfulAPI'



//The code to read a file was from https://developer.mozilla.org/pt-BR/docs/Web/API/FileReader/onload

/*
 * Renders the home page.
 */
export default class Home extends Component {

    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this);
        this.sendItineraryRequest = this.sendItineraryRequest.bind(this)
        this.reRenderNewMap = this.reRenderNewMap.bind(this)
        this.clearMap = this.clearMap.bind(this)
        this.download = this.download.bind(this)
        this.createUploadButton = this.createUploadButton.bind(this)
        this.createResetButton = this.createResetButton.bind(this)
        this.createDownloadButton = this.createDownloadButton.bind(this)
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                        {this.renderMap()}
                    </Col>
                    <Col xs={12} sm={12} md={5} lg={4} xl={3}>
                        {this.renderIntro()}

                    </Col>
                </Row>
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
            </Container>
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


    renderIntro(){
        return(
            <Pane header={'Itinerary Menu'}
                 bodyJSX={
                    <div>

                        <row>
                         {'Choose your file'}
                        </row>
                        <span>

                         {this.createUploadButton()}

                         {this.createResetButton()}

                         {this.createDownloadButton()}

                        </span>
                    </div>}
        />
    );
    }


    createDownloadButton(){
        return(
            <Card>
                <CardBody>
                     <CardTitle><b>Download Trip Itinerary</b></CardTitle>
                    <row>
                        <Button onClick={this.download}>Download Trip Itinerary</Button>
                    </row>

                </CardBody>
            </Card>
        );
    }


    createUploadButton(){
        return(
            <Card>
                <CardBody>
                    <CardTitle><b>Upload Itinerary</b></CardTitle>
                    <input type="file"name="myFile" onChange={this.onChange}/>
                </CardBody>
            </Card>
             );

    }

    createResetButton(){
        return(
            <Card>
                <CardBody>
                    <CardTitle><b>Reset Map</b></CardTitle>
                    <row>
                        <Button onClick={this.clearMap}>Reset Map to default</Button>
                    </row>
                </CardBody>
             </Card>
    );
    }





    basicItinerary() {
        return (
            <Pane header={'Itinerary'}
                  bodyJSX={'Your itinerary will load here'}/>
        );
    }

    changeStartLocation(idx) {
        let places = this.props.JSONString.body.places;
        var newplaces = [];
        for (var i = 0; i < places.length; i++) {
            newplaces[i] = places[(idx + i) % places.length];
        }
        this.props.updatePlacesArray(newplaces);
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

        console.log("modified " , places)
        let distances = this.props.JSONString.body.distances
        var body = places.map((item, idx) => <Pane header= {'Location ' + (idx + 1) + ': ' + item.name} bodyJSX =  {`Latitude: ${item.latitude} Longitude: ${item.longitude}  Distance: ${item.distance}`} />);

        return (
            <Pane header={'Itinerary'}
                  bodyJSX = {
                      <div>{body}
                          <Card style = {footerStyle}>
                              {`  You have  ${numStops}  stops on your trip totalling  ${totalDistance}  miles.`}
                          </Card>
                      </div>
                  }
            />
        );
    }

    clearMap(){
        this.props.clearMapState();
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

    onChange(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (event) =>  {
            // The file's text will be printed here
            var inputData = event.target.result
            this.sendItineraryRequest(JSON.parse(inputData))

        };
        reader.readAsText(file);
        event.target.value = null;
    }

    sendItineraryRequest(requestBody) {

        sendServerRequestWithBody('itinerary', requestBody, this.props.clientSettings.serverPort)
            .then((response) => {
                this.props.liftHomeState(response);
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
        if (this.props.boolMarker == false) {
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
            )
        }
        else {
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
                            this.props.markers.map((position, idx) =>
                                <Marker key={`marker-${idx}`} position={position} icon={this.markerIcon()}>
                                    <Popup><div>Location {idx + 1}<br /><button onClick={() => this.changeStartLocation(idx)}>Make Origin</button></div></Popup>
                                </Marker>
                            )}

                    </Map>
                </div>

            );
        }
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
}