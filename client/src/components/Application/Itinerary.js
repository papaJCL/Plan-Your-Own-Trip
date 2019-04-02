import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle , Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Form, Label, Input  } from 'reactstrap';
import BootstrapTable1 from 'react-bootstrap-table-next';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit';
import { sendServerRequestWithBody } from '../../api/restfulAPI'



let order = 'desc';

export default class Iitnerary extends Component {

    constructor(props) {
        super(props)
        this.renderItinerary = this.renderItinerary.bind(this)
        this.basicItinerary = this.basicItinerary.bind(this)
        this.deleteFunc = this.deleteFunc.bind(this)
        this.makeOriginFunc = this.makeOriginFunc.bind(this)
        this.changeFunc = this.changeFunc.bind(this)
        this.addCols =this.addCols.bind(this)
        this.convertUnitsToNum = this.convertUnitsToNum.bind(this)
    }


    varBody(){
        let work = this.props.SQLJson.places
        var body = work.map((item, idx) =>
            <tr>
                <td> {idx + 1} </td>
                <td> {item.id} </td>
                <td> {item.name} </td>
                <td> {item.altitude} </td>
                <td> {item.latitude} </td>
                <td> {item.longitude} </td>
                <td> {item.municipality} </td>
                <td> {this.buttonSQL(idx)} </td>
            </tr>
        )
        return(body)
    }


    SQLBody(){
        if (this.props.SQLJson.places == null) return;
        else{ return( this.varBody());
        }
    }

    buttonSQL(idx){
        let work = this.props.SQLJson.places[idx]
        return(
            <button onClick={() => this.callNewItineraryWithSQL(work) }>Add to Itinerary</button>
        );
    }

    callNewItineraryWithSQL(work){
        this.props.addLocation(work.name, work.latitude, work.longitude);
        return (this.props.updateItinerarySQL(work));
    }

    SQLMenu(){
        return(
            <row>
                <Pane header = {'SQL Header'}
                      bodyJSX ={
                          <div>
                              <Table>
                                  <thead>
                                  <tr>
                                      <th>#</th>
                                      <th>ID</th>
                                      <th>Name</th>
                                      <th>Altitude</th>
                                      <th>Latitude</th>
                                      <th>Longitude</th>
                                      <th>Municipality</th>
                                      <th>Add to Itinerary</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {this.SQLBody()}
                                  </tbody>
                              </Table>
                          </div>
                      }
                />
            </row>
        )
    }

    render() {
        if (this.props.boolSQL == true){
            return(
                <div>
                    {this.SQLMenu()}
                    <Row>
                        <Col xs={12}>
                            {this.renderItinerary()}
                        </Col>
                    </Row>
                </div>
            );
        }
        else{
            return(
                <div>
                    <Row>
                        <Col xs={12}>
                            {this.renderItinerary()}
                        </Col>
                    </Row>
                </div>
            );
        }
    }

    convertUnitsToNum(unit) {
        if (unit == 'miles') {
            return 3959
        }
        if (unit == 'kilometers') {
            return 6371
        }
        if (unit == 'nautical miles') {
            return 3440
        }
    }

    convertIfOriginalNotMiles(oldUnit) {
        if (oldUnit == 6371) {
            return 'kilometers'
        }
        if (oldUnit == 3440) {
            return 'nautical miles'
        }
    }

    convertDistance(distance, activeUnit, oldUnit) {
        if (oldUnit == '' && this.props.origUnit != 3959) {
            oldUnit = this.convertIfOriginalNotMiles(this.props.origUnit)

        }
        else if (oldUnit == '') {
            return distance
        }
        else if (this.props.origUnit != 3959) {
            oldUnit = this.convertIfOriginalNotMiles(this.props.origUnit)
        }
        let newDistance = distance
        let numOldUnit = this.convertUnitsToNum(oldUnit)
        let numNewUnit = this.convertUnitsToNum(activeUnit)
        newDistance = distance * (numNewUnit / numOldUnit)
        newDistance = Math.round(newDistance)
        return newDistance
    }

    getTotalDistance(places) {

        let distanceArray = this.props.JSONString.body.distances
        var totalDistance = 0
        for (var i = 0; i < places.length; i++) {
            totalDistance = distanceArray[i] + totalDistance
        }
        return totalDistance
    }

    renderItinerary() {
        // let places = this.getPlaces()
        // var totalDistance = this.getTotalDistance(places)
        //
        if (this.props.JSONString.length == 0 && this.props.SQLItineraryInfo.length == 0){
            return (
                <div>
                    <Pane header={"Itinerary will load here"}/>
                </div>
            );
        }
        else if (this.props.JSONString.length == 0 && this.props.SQLItineraryInfo.length != 0){
            return (this.returnSQLItinerary());
        }
        else{ return(this.returnMainItinerary())}
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

    addProducts() {
        var products = [];
        const startId = products.length;
        for (let i = 0; i < this.props.JSONString.body.places.length; i++) {
            const id = startId + i;
            products[i] = ({
                id: id + 1,
                name: this.props.names[i],
                latitude: this.props.latitude[i] ,
                longitude: this.props.longitude[i],
                distance: this.convertDistance(this.props.JSONString.body.distances[i], this.props.planOptions.activeUnit,
                    this.props.oldUnits ) + ' ' +  this.props.planOptions.activeUnit,
                delete: '',
                origin: ' '
            });
        }
        return products
    }

    sendSQLRequest(){
        var request = {
            "requestType"    : "itinerary",
            "requestVersion" : 3,
            "options"        : {"earthRadius": "" + Math.round(this.state.JSONString.body.options.earthRadius)},
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

    finalizeSQLItinerary(){
        return (
            <button onClick={() => this.sendSQLRequest()}>Click this when SQL Itinerary is done</button>
        );
    }

    returnSQLItinerary(){
        var products = this.SQLProducts();
        var cols = this.SQLColumns();
        return (
            <div>
                <Pane
                    header={this.finalizeSQLItinerary()}
                    bodyJSX={
                            <BootstrapTable1
                                selectRow={{mode: 'checkbox'}}
                                tabIndexCell
                                bootstrap4
                                keyField="id"
                                data={products}
                                columns={cols}>
                            </BootstrapTable1>
                    }
                />
            </div>
        );
    }

    returnMainItinerary(){
        var products = this.addProducts();
        var cols = this.addCols();
        let totalDistance = this.getTotalDistance(this.props.JSONString.body.places);
        return (
            <div>
                <Pane
                    header={
                        `  You have  ${this.props.JSONString.body.places.length}  stops on your trip totalling
                        ${this.convertDistance(totalDistance, this.props.planOptions.activeUnit, this.props.oldUnits)} ${this.props.planOptions.activeUnit}.`
                    }
                    bodyJSX={
                        <div>
                            <BootstrapTable1
                                selectRow={{mode: 'checkbox'}}
                                tabIndexCell
                                bootstrap4
                                keyField="id"
                                data={products}
                                columns={cols}>
                            </BootstrapTable1>
                        </div>
                    }
                />
            </div>
        );
    }



    makeCheckbox(){
        return(
            <input type="checkbox" />
        );
    }

    returnIDInfo(){
        return(
            <div>
                ID
                <button>Reverse</button>
            </div>
        );
    }

    addCols(){
        var columns = [{
            dataField: 'id',
            text: 'ID',
            sort: true,
            hidden: this.props.filterID,
            headerFormatter: this.returnIDInfo

        },{
            dataField: 'name',
            text: 'Name',
            hidden: this.props.filterName

        },{
            dataField: 'latitude',
            text: 'latitude',
            hidden: this.props.filterLat

        }, {
            dataField: 'longitude',
            text: 'Longitude',
            hidden: this.props.filterLong
        },{

            dataField: 'distance',
            text: 'Leg Distance',
            hidden: this.props.filterDist

        },{
            dataField: 'delete',
            text: 'Delete',
            formatter: this.deleteFunc


        },{
            dataField: 'origin',
            text: 'Make Origin',
            formatter: this.makeOriginFunc

        },{
            dataField: 'change',
            text: 'Switch Order',
            formatter: this.changeFunc

        }];

        return columns
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

    changeFunc(e, column, columnIndex, row, rowIndex) {
        let handleSubmit = (event) => {
            event.preventDefault();
            console.log(this.props.JSONString.body.options.earthRadius)
            let number = document.getElementById(columnIndex);
            this.props.changeOrder(columnIndex, number.value - 1);
        };

        return (
            <form onSubmit={handleSubmit}>
                <input id={columnIndex} type="number" min="1" max={this.props.JSONString.body.places.length} />
                <input type="submit" value="Enter"/>
            </form>
        );
    }

    deleteFunc(e, column, columnIndex, row, rowIndex){
        return (
            <button onClick={() => this.props.deleteLocation(columnIndex)}>Delete</button>
        );
    }

    makeOriginFunc(e, column, columnIndex, row, rowIndex){
        return (
            <button onClick={() => this.props.changeStartLocation(columnIndex)}>Make Origin</button>
        );
    }

    basicItinerary() {
        return (
            <Pane header={'Itinerary'}
                  bodyJSX={'Your itinerary will load here'}/>
        );
    }
}