import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle , Table} from 'reactstrap';
import { Form, Label, Input  } from 'reactstrap';
import BootstrapTable1 from 'react-bootstrap-table-next';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { sendServerRequestWithBody } from '../../api/restfulAPI';
import {renderBasicMap} from './mapItinerary';
import ErrorBanner from './ErrorBanner';



export default class SQL extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonSQL = this.buttonSQL.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.createAddDropDown = this.createAddDropDown.bind(this);
        this.state = {
            boolShowCondensedMap : false,
            lat: 0,
            long: 0
        };
    }

    render() {
        return (
            <div>
                <Pane header={'Search for Destination'}
                              bodyJSX={
                                  <div>
                                  <form onSubmit={this.handleSubmit}>
                                      <label>
                                          <input id="location" type="text" placeholder="Enter Location"/>
                                          {`Check to Filter by Airport`}
                                          <input id="airports" type="checkbox"/>
                                          <input id="name" type="submit" value="Submit"/>
                                      </label>
                                  </form>
                                      {<Button size="sm" onClick={() => this.props.clearSQLState()}>Clear</Button>}
                                  </div>}
                />
                {this.renderSQLTable()}
                {this.createAddDropDown()}
            </div>
        );
    }


    renderSQLTable(){
        if (this.props.SQLJson.length != 0){return(this.SQLTable());}
    }


    sendSQLRequest(){
        var request = {
            "requestType"    : "itinerary",
            "requestVersion" : 4,
            "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius))},
            "places"         : this.props.JSONString.body.places.concat(this.props.SQLItineraryInfo),
            "distances"      : []
        };

        sendServerRequestWithBody('itinerary',request,this.props.clientSettings.serverPort)
            .then((response) => {
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'itinerary')
                if(valid) {
                    this.props.liftHomeState(response);
                    this.props.boolSQLFunc();
                }
            });
    }


    // returnSQLItinerary(){
    //     const products = [];
    //     const startId = products.length;
    //     for (let i = 0; i < this.props.SQLItineraryInfo.length; i++) {
    //         const id = startId + i;
    //         products[i] = ({
    //             id: id + 1,
    //             name: this.props.SQLItineraryInfo[i].name,
    //             latitude: this.props.SQLItineraryInfo[i].latitude ,
    //             longitude: this.props.SQLItineraryInfo[i].longitude,
    //             municipality: this.props.SQLItineraryInfo[i].municipality});}
    //     var cols = this.SQLColumns();
    //     return (
    //         <div>
    //             <Pane
    //                 header={<Button onClick={() => this.sendSQLRequest()}>Click this to add to Itinerary</Button>}
    //                 bodyJSX={<BootstrapTable1
    //                         selectRow={{mode: 'checkbox'}}
    //                         tabIndexCell
    //                         bootstrap4
    //                         keyField="id"
    //                         data={products}
    //                         columns={cols}> </BootstrapTable1> } />
    //         </div>
    //     );
    // }


    SQLTable(){
        return(
            <div>
                <Pane header={" Locations found!"}
                      bodyJSX = {this.SQLTable()} />
            </div>
        );
    }

    buttonSQL(idx){
        let JSONPlaces = this.props.SQLJson.places[idx]
        return(
            <Button onClick={() => this.props.updateItinerarySQL(JSONPlaces) }>+</Button>
        );
    }


    reverseState(boolB){
        return !boolB;
    }


    SQLColumns(){
        return (
        [{
            dataField: 'id',
            text: 'ID'
        },{
            dataField: 'name',
            text: 'Name'
        },{
            dataField: 'latitude',
            text: 'Latitude'
        }, {
            dataField: 'longitude',
            text: 'Longitude'
        },{
            dataField: 'municipality',
            text: 'Municipality'
        }]
        )
    }

    handleSubmit(e) {
        let location = document.getElementById('location').value;

        let narrow = [];
        if(document.getElementById('airports').checked){
            narrow = [{"name":"ports", "values":["airport"]}]
        }

        var request = {
            'requestType':'find',
            'requestVersion': 4,
            'match': this.sanatizeMatch(location),

            'narrow': narrow,
            'limit': 10

        };

        sendServerRequestWithBody('find',request,this.props.clientSettings.serverPort)
            .then((response) => {
                console.log('find return ' , response)
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'find')

                if (valid) {
                    this.props.updateSQLState(response.body);
                }

            });
        e.preventDefault();
    }

    sanatizeMatch(location){
        const alphaNum = /^[0-9a-zA-Z]+$/;
        for(let i = 0; i < location.length; ++i){
            if(!(location.charAt(i).match(alphaNum))){
                location = location.substr(0, i) + '_' + location.substr(i+1);
            }
        } return location;
    }


    SQLTable() {
        let work = this.props.SQLJson.places
        var body = work.map((item, idx) =>
            <tr>
                <td> {this.buttonSQL(idx)} </td><td> {idx + 1} </td> <td> {item.name} </td><td> {item.municipality} </td><td> {Math.round(item.latitude)} </td> <td> {Math.round(item.longitude)} </td>
            </tr>)
        return (
            <Pane header = {this.props.SQLJson.found + " Locations were found! Will only display as many as 10"}
                  bodyJSX = {
                <table class="table-responsive">
                    <thead>
                        <tr>
                            <th>Add</th><th>#</th><th>Name</th><th>Municipality</th><th>Latitude</th><th>Longitude</th>
                        </tr>
                    </thead>
                    <tbody> {body} </tbody>
                </table>}/>
        )
    }

    handleAddSubmit(event) {
        event.preventDefault();
        //var magellan = require('./../../../../node_modules/magellan-coords/magellan');
        let name = document.getElementById('nameAdd').value;
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
                        <input id="nameAdd" type="text" placeholder="Enter Name"/>
                        <input id="lat" type="text" placeholder="Enter Latitude"/>
                        <input id="long" type="text" placeholder="Enter Longitude"/>
                        <input type="submit" value="Submit"/>
                    </form>
                </CardBody>
            </Card>
        );
    }
}