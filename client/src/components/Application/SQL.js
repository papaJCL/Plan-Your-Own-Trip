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
import {renderBasicMap} from './mapItinerary'


export default class SQL extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            boolShowCondensedMap : false,
            lat: 0,
            long: 0
        };
    }

    render() {
        return (
            <div>
                {this.renderBasic()}
                {this.renderSQLTable()}
                {this.renderTableB4Itinerary()}
            </div>
        );
    }

    renderBasic(){
        return (
            <div>
                {this.createSearchBar()}
                <Pane header = {'World map'} bodyJSX={this.renderLeafletMap()} />
            </div>
        );
    }

    renderSQLTable(){
        if (this.props.SQLJson.length != 0){return(this.SQLTable());}
    }

    renderTableB4Itinerary(){
        if (this.props.SQLItineraryInfo.length == 0)return( <Pane header = {"Your added locations will pop up here"} />);
        return(this.returnSQLItinerary());
    }

    finalizeSQLItinerary(){
        return (<button onClick={() => this.sendSQLRequest()}>Click this to add to Itinerary</button> );
    }

    sendSQLRequest(){
        var request = {
            "requestType"    : "itinerary",
            "requestVersion" : 3,
            "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius))},
            "places"         : this.props.SQLItineraryInfo,
            "distances"      : []
        };
        sendServerRequestWithBody('itinerary',request,this.props.clientSettings.serverPort)
            .then((response) => {
                console.log(response.body)
                this.props.liftHomeState(response);
                this.props.boolSQLFunc();
            });

    }


    returnSQLItinerary(){
        var products = this.SQLProducts();
        var cols = this.SQLColumns();
        return (
            <div>
                <Pane
                    header={this.finalizeSQLItinerary()}
                    bodyJSX={<BootstrapTable1
                            selectRow={{mode: 'checkbox'}}
                            tabIndexCell
                            bootstrap4
                            keyField="id"
                            data={products}
                            columns={cols}> </BootstrapTable1> } />
            </div>
        );
    }


    SQLTable(){
        return(
            <div>
                <Pane header={"5 Locations found!"}
                      bodyJSX = {this.SQLTable()} />
            </div>
        );
    }

    buttonSQL(idx){
        let JSONPlaces = this.props.SQLJson.places[idx]
        return(
            <button onClick={() => this.callNewItineraryWithSQL(JSONPlaces) }>Add Location</button>
        );
    }

    buttonSeeMap(latitude, longitude){
        return(
            <button onClick={() => this.callNewMapState(latitude,longitude) }>See on map</button>
        );
    }

    reverseState(boolB){
        if (boolB == true) return false
        return true
    }

    callNewMapState(latitude,longitude){
        this.setState({
            boolShowCondensedMap : this.reverseState(this.state.boolShowCondensedMap),
            lat : latitude,
            long : longitude
            });
        }


    callNewItineraryWithSQL(JSONPlaces){
        return (this.props.updateItinerarySQL(JSONPlaces));
    }


    varBody(){
        let work = this.props.SQLJson.places
        var body = work.map((item, idx) =>
            <tr>
                <td> {idx + 1} </td> <td> {item.name} </td> <td> {item.altitude} </td> <td> {item.latitude} </td> <td> {item.longitude} </td>
                <td> {item.municipality} </td> <td> {this.buttonSQL(idx)} </td> <td> {this.buttonSeeMap(item.latitude, item.longitude)}</td>
            </tr>)
        return(body)
    }


    SQLProducts(){
        const products = [];
        const startId = products.length;
        for (let i = 0; i < this.props.SQLItineraryInfo.length; i++) {
            const id = startId + i;
            products[i] = ({
                id: id + 1,
                name: this.props.SQLItineraryInfo[i].name,
                latitude: this.props.SQLItineraryInfo[i].latitude ,
                longitude: this.props.SQLItineraryInfo[i].longitude,
                municipality: this.props.SQLItineraryInfo[i].municipality
            });
        }
        return products
    }

    SQLColumns(){
        var columns = [{
            dataField: 'id',
            text: 'ID',

        },{
            dataField: 'name',
            text: 'Name',

        },{
            dataField: 'latitude',
            text: 'latitude',

        }, {
            dataField: 'longitude',
            text: 'Longitude',
        },{
            dataField: 'municipality',
            text: 'Municipality'
        }];
        return columns
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
            <div>
            <CardTitle><b>Search for Destination</b></CardTitle>
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <input id="location" type="text" placeholder="Enter Location"  />
                                <input id="region" type="text" placeholder="Enter Region"  />
                                <input id="country" type="text" placeholder="Enter Country"  />
                                <input id="continent" type="text" placeholder="Enter Continent"  />
                                <input id="name" type="submit" value="Submit"/>
                            </label>
                        </form>
            </div>
        );
    }

    renderLeafletMap() {
        if (this.state.boolShowCondensedMap == true) {return ( this.renderCondensedMap(this.state.long, this.state.lat));}
        return (this.renderBasicMap());
    }


    renderCondensedMap(lat, long){
        return(
            <div>
                <Map zoom = {13} center = {[long,lat]} animate = {true} style={{height: 500, maxwidth: 700}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
                    <Marker position = {[long,lat]} icon={this.markerIcon()}/>
                </Map>
            </div>
        )
    }

    renderBasicMap(){
        return(
            <div>
                <Map center={[0,0]} zoom={2} style={{height: 500, maxwidth: 700}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
                </Map>
            </div>
        )
    }

    SQLTable() {
        return (
            <Pane header = {"5 Locations were found! "} bodyJSX = {
                <Table>
                    <thead><tr>
                        <th>#</th><th>Name</th><th>Altitude</th><th>Latitude</th><th>Longitude</th><th>Municipality</th><th>Add to Itinerary</th><th></th>
                    </tr></thead>
                <tbody> {this.varBody()} </tbody>
                </Table>}/>
        )
    }

    markerIcon() {
        return L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }

}