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
import BootstrapTable1 from 'react-bootstrap-table-next';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


export default class Iitnerary extends Component {

    constructor(props) {
        super(props)
        this.renderItinerary = this.renderItinerary.bind(this)
        this.basicItinerary = this.basicItinerary.bind(this)
        this.deleteFunc = this.deleteFunc.bind(this)
        this.makeOriginFunc = this.makeOriginFunc.bind(this)
        this.reverseList = this.reverseList.bind(this)
        this.renderDropDown = this.renderDropDown.bind(this)
        this.toggle = this.toggle.bind(this)
        this.addCols =this.addCols.bind(this)
        this.state = {
            dropdownOpen: false
        };
    }

    render(){
        return(
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
        )
    }

    convertUnitsToNum(unit){
        if (unit == 'miles'){return 3959}
        if (unit == 'kilometers'){return 6371}
        if (unit == 'nautical miles'){return 3440}
    }

    convertIfOriginalNotMiles(oldUnit){
        if (oldUnit == 6371){ return 'kilometers'}
        if (oldUnit == 3440){ return 'nautical miles'}
    }

    convertDistance(distance, activeUnit, oldUnit){
        if (oldUnit == '' && this.props.origUnit != 3959){
            oldUnit = this.convertIfOriginalNotMiles(this.props.origUnit)
        }
        else if (oldUnit == ''){ return distance }
        else if (this.props.origUnit != 3959){
            oldUnit = this.convertIfOriginalNotMiles(this.props.origUnit)
        }
        let newDistance = distance
        let numOldUnit = this.convertUnitsToNum(oldUnit)
        let numNewUnit = this.convertUnitsToNum(activeUnit)
        newDistance = distance * (numNewUnit/numOldUnit)
        newDistance = Math.round(newDistance)
        return newDistance
    }

    getPlaces(){
        let places = this.props.JSONString.body.places
        let distanceArray = this.props.JSONString.body.distances
        for (var i = 0; i < places.length; i++){
            places[i].distance = distanceArray[i]
        }
        return places
    }

    getTotalDistance(places){

        let distanceArray = this.props.JSONString.body.distances
        var totalDistance =0
        for (var i = 0; i < places.length; i++) {
            totalDistance = distanceArray[i] + totalDistance
        }
        return totalDistance
    }

    renderItinerary(){
        let places = this.getPlaces()
        var totalDistance = this.getTotalDistance(places)

        var products = this.addProducts()
        var cols =this.addCols()

        return (
            <Pane
                header={
                    `  You have  ${places.length}  stops on your trip totalling
                    ${this.convertDistance(totalDistance, this.props.planOptions.activeUnit, this.props.oldUnits )} ${this.props.planOptions.activeUnit}.`
                }
                bodyJSX ={
                    <div>
                        <BootstrapTable1
                            selectRow={ { mode: 'checkbox' } }
                            tabIndexCell
                            bootstrap4
                            keyField="id"
                            data={ products }
                            columns={ cols }>
                            /*
                                <TableHeaderColumn width='150' dataField='id' isKey={true} dataSort={true}>ID <button>Reverse</button></TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='name'>Name  </TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='latitude'>Latitude  </TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='longitude'>Longitude   </TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='distance'>Leg Distance </TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='delete' dataFormat={this.deleteFunc }>Delete </TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='origin' dataFormat={this.makeOriginFunc}>Make Origin </TableHeaderColumn>
                                <TableHeaderColumn width='150' dataField='change' dataFormat={this.renderDropDown}>Change Order </TableHeaderColumn>
                           */ </BootstrapTable1>

                    </div>
                }
            />
        );
    }

    addCols(){
        const columns = [{
            dataField: 'id',
            text: 'ID',
            sort: true
        },{
            dataField: 'name',
            text: 'Name'

        },{
            dataField: 'latitude',
            text: 'latitude'

        }, {
            dataField: 'longitude',
            text: 'Longitude'
        },{

            dataField: 'distance',
            text: 'Leg Distance'

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
            text: 'Change Order',
            formatter: this.renderDropDown

        }];

        return columns
    }




    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    renderDropDown() {
        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    Other Options
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Itinerary actions</DropdownItem>
                    <DropdownItem>Add stop</DropdownItem>
                    <DropdownItem> Remove stop</DropdownItem>
                    <DropdownItem divider/>
                    <DropdownItem>Change start point</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    }



    reverseList(){
        return(
            <button>Reverse</button>
        )
    }

    deleteFunc(e, column, columnIndex, row, rowIndex){
        console.log(columnIndex)
        console.log("LAND HERE delete " + columnIndex)
        return (
            <button onClick={() => this.props.deleteLocation(columnIndex)}>Delete</button>
        );
    }

    makeOriginFunc(e, column, columnIndex, row, rowIndex){
        console.log(columnIndex)
        console.log("LAND HERE create" + columnIndex)
        return (
            <button onClick={() => this.props.changeStartLocation(columnIndex)}>Make Origin</button>
        );
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


    basicItinerary() {
        return (
            <Pane header={'Itinerary'}
                  bodyJSX={'Your itinerary will load here'}/>
        );
    }

}