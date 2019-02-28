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

        this.state = {
            clientSettings: {
                serverPort: getOriginalServerPort()
            },
            JSONString: [] ,
            returnFile: [],
            latitude: [],
            longitude: [],
            markers: [[]],
            boolMarker: false ,
            polyLineCoor: [[]],
            names : []
        };
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
                        {this.renderItineratorIntro()}

                    </Col>
                </Row>
                <Row>
                    {this.state.boolMarker ?(
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
        var content = JSON.stringify(this.state.returnFile);
        var fileName = 'my Trip';
        var contentType = 'text/plain';
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }


        renderItineratorIntro(){
        return(
            <Pane header={'Itinerary Menu'}
                  bodyJSX={
                      <div>

                          <row>
                              {'Choose your file'}
                          </row>
                          <span>



                              <Card>
                                  <CardBody>
                                      <CardTitle><b>Download Itinerary</b></CardTitle>
                                      <CardSubtitle>Click this button to upload an itinerary and start planning your trip!</CardSubtitle>


                              <input type="file"
                                     name="myFile"
                                     onChange={this.onChange}/>

                               </CardBody>
                              </Card>



                              <Card>
                                  <CardBody>
                                      <CardTitle><b>Reset Map</b></CardTitle>
                                      <CardSubtitle>This button will reset the map so you can upload a new itinerary.</CardSubtitle>

                                      <row>
                                          <Button onClick={this.clearMap}>Reset Map to default</Button>
                                      </row>

                                  </CardBody>
                                </Card>

                                 <Card>
                                  <CardBody>
                                      <CardTitle><b>Download Trip Itinerary</b></CardTitle>
                                      <CardSubtitle>This button will download your trip itinerary to your downloads folder.</CardSubtitle>
                                      <row>
                                          <Button onClick={this.download}>Download Trip Itinerary</Button>
                                      </row>

                                  </CardBody>
                                </Card>

                          </span>
                      </div>}
            />
        );
    }

    basicItinerary() {
        return (
            <Pane header={'Itinerary'}
                  bodyJSX={'Your itinerary will load here'}/>
        );
    }

    renderItinerary(){
        console.log("distances " , this.state.JSONString.body.distances)

        var footerStyle = {
            backgroundColor: 'grey',
            alignSelf: 'center',
            color: 'white'
        };

        let places = this.state.JSONString.body.places
        let distanceArray = this.state.JSONString.body.distances

        for (var i = 0; i < places.length; i++){
            places[i].distance = distanceArray[i]
        }

        var totalDistance =0
        for (var i = 0; i < places.length; i++){

            totalDistance = distanceArray[i] + totalDistance
        }
        var numStops = places.length

        console.log("modified " , places)
        let distances = this.state.JSONString.body.distances
        var body = places.map(item => <Pane bodyJSX =  {`  Location: ${item.name}  Latitude: ${item.latitude} Longitude: ${item.longitude}  Distance: ${item.distance}`} />);

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
        this.setState({
            JSONString: [] ,
            returnFile: [],
            latitude: [],
            longitude: [],
            markers: [[]],
            boolMarker: false ,
            names: []
        });
    }

    reRenderNewMap(){
        let places = this.state.JSONString.body.places
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

        this.setState({
            latitude: latitude,
            longitude: longitude,
            markers: markers,
            boolMarker: true ,
            polyLineCoor : polyLine,
            names : names
        });
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
        //this.reRenderNewMap()
    }

    sendItineraryRequest(requestBody) {

        sendServerRequestWithBody('itinerary', requestBody, this.state.clientSettings.serverPort)
            .then((response) => {
                this.setState({
                    JSONString: response,
                    returnFile: response.body
                } , () => {
                    this.reRenderNewMap();
                });
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
        if (this.state.boolMarker == false) {
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
                    <Map bounds = {this.state.markers} animate = {true}
                         style={{height: 500, maxwidth: 700}}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Polyline
                            positions ={this.state.polyLineCoor}
                            color = {'black'}
                            weight = {5}
                            opacity = {0.5}
                            smoothFactor = {1}
                        />
                        {
                            this.state.markers.map((position, idx) =>
                                <Marker key={`marker-${idx}`} position={position} icon={this.markerIcon()}>
                                    <Popup className="font-weight-extrabold">Location1</Popup>
                                </Marker>
                            )}

                    </Map>
                </div>

            );
        }
    }

    renderIntro() {
        return(
            <Pane header={'Let us help you plan your next trip!'}
                  bodyJSX={'Let us help you plan your next trip. To calculate the distance between two points go to the calculator and enter your origin and destination. ' +
                  'To select a different unit to use for those calculations, use the options page. You can also click on the button below' +
                  ' to add a travel itinerary that will be displayed on the map. Bon Voyage!'}
            />
        );
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