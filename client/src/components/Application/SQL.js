import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle , Table} from 'reactstrap';
import { Form, Label, Input  } from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';
import { sendServerRequestWithBody } from '../../api/restfulAPI';
import {renderBasicMap} from './mapItinerary';


export default class SQL extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.buttonSQL = this.buttonSQL.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.createAddDropDown = this.createAddDropDown.bind(this);
        this.filters = this.filters.bind(this);
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
                                          <Input id="location" type="text" placeholder="Enter Location"/>
                                          {this.filters()}
                                          <Input className='btn-csu w-100 text-left' id="name" type="submit" value="Submit"/>
                                      </label>
                                  </form>
                                  </div>}
                />
                {this.renderSQLTable()}
                {this.createAddDropDown()}
            </div>
        );
    }

    filters(){
        return(
            <Select
                isMulti
                name="countries"
                placeholder="Search Countries"
                options={ [
                    {value: 'greatestCountry', label: 'Murica'},
                    {value: 'bestCountry', label: 'US of A'},
                    {value: 'motherLand', label: 'Gulag'}
                ] }
                className="basic-multi-select"
                classNamePrefix="select"
            />
        );
    }

    renderSQLTable(){
        if (this.props.SQLJson.length != 0){return(this.SQLTableBody());}
    }

    sendSQLRequest(){
        var request = {
            "requestType"    : "itinerary",
            "requestVersion" : 5,
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

        var request = {
            'requestType':'find',
            'requestVersion': 5,
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

    SQLTableBody() {
        let work = this.props.SQLJson.places
        var body = work.map((item, idx) =>
            <tr>
                <td> {this.buttonSQL(idx)} </td><td> {idx + 1} </td><td> {item.name} </td><td> {item.municipality} </td><td> {item.region} </td><td> {item.country} </td> <td> {item.continent} </td>
            </tr>)
        return (
            <Pane header = {this.props.SQLJson.found + " Locations were found! Will only display as many as 10"}
                  bodyJSX = {
                      <div>
                      {<Button size="sm" onClick={() => this.addAllButton()}>Add all locations</Button>}
                      {<Button size="sm" onClick={() => this.props.clearSQLState()}>Clear</Button>}
                <table class="table-responsive">
                    <thead>
                        <tr>
                            <th>Add</th><th>#</th><th>Name</th><th>Municipality</th><th>Region</th><th>Country</th><th>Continent</th>
                        </tr>
                    </thead>
                    <tbody> {body} </tbody>
                      </table>
                      </div>
                  }
            />
        )
    }

    addAllButton(){
        for (let i = 0; i < 10; i++) (this.props.showMarkers[0]) ? this.props.showMarkers.push(true) : this.props.showMarkers.push(false);
        var requestAll = {
            "requestType"    : "itinerary",
            "requestVersion" : 5,
            "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius))},
            "places"         : this.props.JSONString.body.places.concat(this.props.SQLJson.places),
            "distances"      : []
        }
        sendServerRequestWithBody('itinerary',requestAll,this.props.clientSettings.serverPort)
            .then((response) => {
                var valid = this.props.checkServerResponse(response.statusCode,response.body, 'itinerary')
                    this.props.liftHomeState(response);
            });
    }

    handleAddSubmit(event) {
        event.preventDefault();
        let name = document.getElementById('nameAdd').value;
        let lat = document.getElementById('lat').value;
        let long = document.getElementById('long').value;
        this.props.addLocation(name, lat, long);
    }

    createAddDropDown() {
        return (
            <Card>
                <CardBody>
                    <CardTitle><b>Add a New Location</b></CardTitle>

                    <form onSubmit={this.handleAddSubmit}>
                        <Input id="nameAdd" type="text" placeholder="Enter Name"/>
                        <Input id="lat" type="text" placeholder="Enter Latitude"/>
                        <Input id="long" type="text" placeholder="Enter Longitude"/>
                        <Input className='btn-csu w-100 text-left' type="submit" value="Submit"/>
                    </form>
                </CardBody>
            </Card>
        );
    }
}