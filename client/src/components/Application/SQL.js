import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle , Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Form, Label, Input  } from 'reactstrap';
import BootstrapTable1 from 'react-bootstrap-table-next';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { sendServerRequestWithBody } from '../../api/restfulAPI'


export default class SQL extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
            <Pane header = {'SQL markers will load here'}
                  bodyJSX={[this.createSearchBar() , this.renderLeafletMap()]}
            />
            <Pane header = {'The table will load here'}/>
            </div>
        );
    }

    handleSubmit(e) {
        let location = document.getElementById('location').value;
        let region = document.getElementById('region').value;
        let country = document.getElementById('country').value;
        let continent = document.getElementById('continent').value;

        var request = {
            'requestType':'find',
            'requestVersion': 3,
            'match': location,
            'limit': 5
        };
        sendServerRequestWithBody('find',request,this.props.clientSettings.serverPort)
            .then((response) => {
                console.log(response.body)
                this.props.updateSQLState(response.body);
            });
        e.preventDefault();

    }

    createSearchBar(){
        return(
                <CardBody>
                    <CardTitle><b>Search for Destination</b></CardTitle>
                    <row>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <input id="location" type="text" placeholder="Enter Location"  />
                                <input id="region" type="text" placeholder="Enter Region"  />
                                <input id="country" type="text" placeholder="Enter Country"  />
                                <input id="continent" type="text" placeholder="Enter Continent"  />
                                <input id="name" type="submit" value="Submit"/>
                            </label>
                        </form>
                    </row>
                </CardBody>
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