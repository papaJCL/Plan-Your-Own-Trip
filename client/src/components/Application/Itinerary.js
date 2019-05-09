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
        this.deleteFunc = this.deleteFunc.bind(this)
        this.showFunc = this.showFunc.bind(this)
        this.addCols =this.addCols.bind(this)
        this.convertUnitsToNum = this.convertUnitsToNum.bind(this);
        this.handleStartSubmit = this.handleStartSubmit.bind(this)
        this.handleSwapSubmit = this.handleSwapSubmit.bind(this)
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
                municipality: this.props.JSONString.body.places[i].municipality,
                country: this.props.JSONString.body.places[i].country,
                continent: this.props.JSONString.body.places[i].continent,
                latitude: this.props.latitude[i],
                longitude: this.props.longitude[i],
                distance: this.convertDistance(this.props.JSONString.body.distances[i], this.props.planOptions.activeUnit,
                    this.props.oldUnits ) + ' ' +  this.props.planOptions.activeUnit,
                delete: '',
                origin: ' '
            });
        }
        return products
    }


    handleSwapSubmit(event) {
        event.preventDefault();
        let swap1 = document.getElementById('swap1').value;
        let swap2 = document.getElementById('swap2').value; console.log("swap1", swap1, " swap2", swap2)
        let places = this.props.JSONString.body.places;
        let idx = - 1;
        let idx0 = - 1;
        for (var i = 0; i < places.length; i++) {
            if (places[i].name.toLowerCase().includes(swap1.toString().toLowerCase())) {
                idx = i;
            }
            else if (places[i].name.toLowerCase().includes(swap2.toString().toLowerCase())) {
                idx0 = i;
            }
        }
        if (idx === - 1 || idx0 === -1) {
            alert("Please Enter a Valid Location Name");
            return;
        }


        this.props.changeOrder(idx0, idx);
    };

    handleStartSubmit(event) {
        event.preventDefault();
        let string = document.getElementById('changeStart').value;
        this.props.changeStartLocation(string);
    };

    optionsDropDown() {
        return (
          <Dropdown>
              <Dropdown.Toggle size="sm" variant="Secondary" caret>Options</Dropdown.Toggle>
              <Dropdown.Menu>
                  <Dropdown>
                      <Dropdown.Toggle variant="white" caret> Change Start Location </Dropdown.Toggle>
                      <Dropdown.Menu >
                  <form onSubmit={this.handleStartSubmit}>
                  <Input id="changeStart" type="text" placeholder="Enter Location Name"/> <Input type="submit" value="Enter"/>
                  </form>
                      </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown>
                      <Dropdown.Toggle variant="white" caret> Swap Locations </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <form onSubmit={this.handleSwapSubmit}>
                              <Input id="swap1" type="text" placeholder="Enter 1st Location"/><Input id="swap2" type="text" placeholder="Enter 2nd Location"/><Input type="submit" value="Enter"/>
                          </form>
                      </Dropdown.Menu>
                  </Dropdown>
                  <DropdownItem as="button" onClick={() => {this.props.reverseList(); }}>Reverse Itinerary</DropdownItem>
              </Dropdown.Menu>
          </Dropdown>
        );
    }

    returnMainItinerary(){
        let totalDistance = this.getTotalDistance(this.props.JSONString.body.places);
        return (
            <div>
                <Pane
                    header={`  You have  ${this.props.JSONString.body.places.length}  stops on your trip totalling${this.convertDistance(totalDistance, this.props.planOptions.activeUnit, this.props.oldUnits)} ${this.props.planOptions.activeUnit}.`}
                    bodyJSX={
                        <div>
                            <Row>
                            <DropdownButton size="sm" variant="Secondary" id="dropdown-basic-button" title="Filter Results" caret>
                                <Dropdown.Item onClick={() => this.props.renderFilterID()}>ID</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterName()}>Name</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterMunicipality()}>Municipality</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterCountry()}>Country</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterContinent()}>Continent</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterLatitude()}>Latitude</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterLongitude()}>Longitude</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.props.renderFilterDistance()}>Leg Distance</Dropdown.Item>
                            </DropdownButton>{this.optionsDropDown()}{this.returnBootStrapTable1()}
                            </Row>
                        </div>} /></div>);
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
        var columns = [
        {dataField: 'id', text: 'ID', sort: true, hidden: this.props.filterID, formatter: this.deleteFunc, headerStyle: (colum, colIndex) => {return { width: '100px', textAlign: 'center' };}
        },{dataField: 'name', text: 'Name', hidden: this.props.filterName, formatter: this.showFunc, headerStyle: (colum, colIndex) => {return { width: '300px', textAlign: 'center' };}
            },{dataField: 'municipality', text: 'Municipality', hidden: this.props.filterMunicipality
            },{dataField: 'country', text: 'Country', hidden: this.props.filterCountry
            },{dataField: 'continent', text: 'Continent', hidden: this.props.filterContinent
            },{dataField: 'latitude', text: 'Latitude', hidden: this.props.filterLat
        },{dataField: 'longitude', text: 'Longitude', hidden: this.props.filterLong
        },{dataField: 'distance', text: 'Leg Distance', hidden: this.props.filterDist, headerStyle: (colum, colIndex) => {return { width: '100px', textAlign: 'center' };}
        }];
        return columns
    }

    showFunc(e, column, columnIndex, row, rowIndex) {

        return (
            <div>
                <Button size="sm" color="white" onClick={() => this.props.setShowMarkerState(column.id)}><span role="img" style={{color: "blue"}}>👁</span></Button>
                {column.name}
            </div>
        );
    }

    deleteFunc(e, column, columnIndex, row, rowIndex) {
        return (
            <div>
                <Button size="sm" color="white" onClick={() => this.props.deleteLocation(column.id - 1)}><span role="img" style={{color: "red"}}>❌</span></Button>
                    {column.id}
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