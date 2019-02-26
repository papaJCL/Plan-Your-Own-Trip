import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'
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

        this.state = {
            clientSettings: {
                serverPort: getOriginalServerPort()
            },
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
            </Container>
        );
    }

    renderItineratorIntro(){
        return(
            <Pane header={'Choose your file'}
                  bodyJSX={
                      <div>
                          <span>
                              <input type="file"
                                name="myFile"
                                onChange={this.onChange} />
                          </span>
                      </div>}
            />
        );
    }

    work(){

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
    }

    sendItineraryRequest(requestBody) {

        sendServerRequestWithBody('itinerary', requestBody, this.state.clientSettings.serverPort)
            .then((response) => {
                console.log(response.body)
            });
    }

    renderMap() {
        return (
            <Pane header={'Where Am I?'}
                  bodyJSX={this.renderLeafletMap()}
            />
        );
    }

    renderLeafletMap() {
        return (
            <div>
                <Map center={[40.576179, -105.080773]} zoom={10} setView={true}
                     style={{height: 500, maxwidth: 700}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={[40.576179, -105.080773]}
                            icon={this.markerIcon()}>
                        <Popup className="font-weight-extrabold">Colorado State University</Popup>
                    </Marker>
                </Map>
            </div>
        );
    }

    renderIntro() {
        return(
            <Pane header={'Bon Voyage!'}
                  bodyJSX={'Let us help you plan your next trip.'}
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
