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
import { Form, Label, Input} from 'reactstrap';
import { Dropdown, DropdownItem, DropdownButton} from 'react-bootstrap';

import BootstrapTable1 from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

export default class Iitnerary extends Component {

    constructor(props) {
        super(props)
        this.renderItinerary = this.renderItinerary.bind(this)
        this.basicItinerary = this.basicItinerary.bind(this)
        this.changeFunc = this.changeFunc.bind(this)
        this.addCols =this.addCols.bind(this)
        this.convertUnitsToNum = this.convertUnitsToNum.bind(this);
    }


    render() {
        return(
            <div>
                <Row>
                    <Col  xs={12}>
                        {this.renderItinerary()}
                    </Col>
                </Row>
            </div>
        );
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
        if (this.props.JSONString.body.places.length === 0) {
            return (<div><Pane header={"Itinerary will load here"}/></div>);}
        return(this.returnMainItinerary())
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

    returnMainItinerary(){
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
                            <Row>
                            <DropdownButton id="dropdown-basic-button" title="Filter Results" caret>
                                <Dropdown.Item onClick={() => this.props.renderFilterName()}>Name</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterLatitude()}>Latitude</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterLongitude()}>Longitude</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterDistance()}>Leg Distance</Dropdown.Item>
                            </DropdownButton>
                            {<Button onClick={() => this.reverseList()}>Reverse List</Button>}
                            {this.returnBootStrapTable1()}
                            </Row>
                        </div>
                    }
                />
            </div>
        );
    }

    reverseList(){
        var requestString = {
            "requestType"    : "itinerary",
            "requestVersion" : 4,
            "options"        : {"earthRadius": "" + Math.round(parseFloat(this.props.JSONString.body.options.earthRadius))},
            "places"         : this.props.JSONString.body.places.reverse(),
            "distances"      : []
        }
        this.props.sendItineraryRequest(requestString);
    }

    returnBootStrapTable1(){
        var products = this.addProducts();
        var cols = this.addCols();
        return(
            <table class="table-responsive">
                <tbody>
                    <BootstrapTable1
                        tabIndexCell
                        condensed
                        bootstrap4
                        keyField="id"
                        data={products}
                        columns={cols}
                        pagination={ paginationFactory({showTotal: true, firstPageText: 'First', prePageText: 'Back', nextPageText: 'Next',
                            lastPageText: 'Last', nextPageTitle: 'First page', prePageTitle: 'Pre page', firstPageTitle: 'Next page', lastPageTitle: 'Last page'}) }>
                    </BootstrapTable1>
                </tbody>
            </table>
            );
        }


    makeCheckbox(){
        return(
            <input type="checkbox" />
        );
    }

    addCols(){
        var columns = [{dataField: 'id', text: 'ID', sort: true, hidden: this.props.filterID
        },{dataField: 'name', text: 'Name', hidden: this.props.filterName
        },{dataField: 'options', text: 'Options', formatter: this.changeFunc
        },{dataField: 'latitude', text: 'Latitude', hidden: this.props.filterLat
        }, {dataField: 'longitude', text: 'Longitude', hidden: this.props.filterLong
        },{dataField: 'distance', text: 'Leg Distance', hidden: this.props.filterDist
        }];
        return columns
    }

    changeFunc(e, column, columnIndex, row, rowIndex) {
        let handleSubmit = (event) => {
            event.preventDefault();
            let number = document.getElementById(columnIndex);
            if (number.value === "" || number.value > this.props.JSONString.body.places.length) {
                alert("Please enter a valid integer from " + 1 + " to " + this.props.JSONString.body.places.length);
                return;
            }
            this.props.changeOrder(columnIndex, number.value - 1);
        };

        return (
            <div>
                <row>
                    <Button onClick={() => this.props.setShowMarkerState(columnIndex + 1)}><span fontsize = "40" role="img">👁</span></Button>
                    <Button onClick={() => this.props.deleteLocation(columnIndex)}><span fontsize = "40" role="img">❌</span></Button>
                    <Button onClick={() => this.props.changeStartLocation(columnIndex)}><span fontsize = "40" role="img">⭱</span></Button>
                </row>

                <form onSubmit={handleSubmit}>
                    <input id={columnIndex} type="number" min="1" style={{width: "45px"}} />
                    <input type="submit" value="Enter"/>
                </form>

            </div>

        );
    }

    basicItinerary() {
        return (
            <Pane header={'Itinerary'}
                  bodyJSX={'Your itinerary will load here'}/>
        );
    }
}