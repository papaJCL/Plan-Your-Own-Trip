import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';

export default class mapItinerary extends Component {

    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this);
        this.clearMap = this.clearMap.bind(this)
        this.download = this.download.bind(this)
        this.createUploadButton = this.createUploadButton.bind(this)
        this.createResetButton = this.createResetButton.bind(this)
        this.createDownloadButton = this.createDownloadButton.bind(this)
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
                          <row>
                              {'Choose your file'}
                          </row>
                          <span>
                              {this.createUploadButton()}
                              {this.createResetButton()}
                              {this.createDownloadButton()}
                        </span>
                      </div>
                  }
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
        )
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
                        this.props.markers.map((position, idx) =>
                            <Marker key={`marker-${idx}`} position={position} icon={this.markerIcon()}>
                                <Popup><div align="center"><b>Location {idx + 1}</b><br /><button onClick={() => this.props.changeStartLocation(idx)}>Make Origin</button><br /><button onClick={() => this.props.deleteLocation(idx)}>Delete</button><br /></div></Popup>
                            </Marker>
                        )}

                </Map>
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
