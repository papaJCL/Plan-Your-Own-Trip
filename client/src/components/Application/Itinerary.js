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
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown } from 'reactstrap';

let order = 'desc';

export default class Iitnerary extends Component {

    constructor(props) {
        super(props)
        this.renderItinerary = this.renderItinerary.bind(this)
        this.basicItinerary = this.basicItinerary.bind(this)
        this.deleteFunc = this.deleteFunc.bind(this)
        this.makeOriginFunc = this.makeOriginFunc.bind(this)
        this.reverseList = this.reverseList.bind(this)
        this.renderDropDown = this.renderDropDown.bind(this)

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
        var body = places.map((item, idx) =>
                <tr>
                    <td> {(idx + 1)}                                                                                   </td>
                    <td> {item.name}                                                                                   </td>
                    <td> {item.latitude}                                                                               </td>
                    <td> {item.longitude}                                                                              </td>
                    <td> {this.convertDistance(item.distance, this.props.planOptions.activeUnit, this.props.oldUnits )}
                         {' '} {this.props.planOptions.activeUnit}                                                     </td>
                    <td> {<button onClick={() => this.props.deleteLocation(idx)}>Delete</button>}                      </td>
                    <td> {<button onClick={() => this.props.changeStartLocation(idx)}>Make Origin</button>}            </td>
                    <td> {this.renderDropDown()}</td>
                </tr>
        )

        // return (
        //     <Pane
        //         header={
        //             `  You have  ${places.length}  stops on your trip totalling
        //             ${this.convertDistance(totalDistance, this.props.planOptions.activeUnit, this.props.oldUnits )} ${this.props.planOptions.activeUnit}.`
        //         }
        //         bodyJSX ={
        //         <Table size="sm" height='120' scrollTop={ 'Bottom' } >
        //             <thead>
        //                 <tr>
        //                     <th>ID</th>
        //                     <th>Name</th>
        //                     <th>Latitude</th>
        //                     <th>Longitude</th>
        //                     <th>Leg Distance</th>
        //                     <th>Delete</th>
        //                     <th>Make Origin</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {body}
        //             </tbody>
        //         </Table>
        //         }
        //     />
        //
        // );

        var products = this.addProducts()

        return (
            <Pane
                header={
                    `  You have  ${places.length}  stops on your trip totalling
                    ${this.convertDistance(totalDistance, this.props.planOptions.activeUnit, this.props.oldUnits )} ${this.props.planOptions.activeUnit}.`
                }
                bodyJSX ={
                    <div>
                        <BootstrapTable data={products} >
                            <TableHeaderColumn width='150' dataField='id' isKey={true} dataSort={true}>ID <button>Reverse</button></TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='name'>Name</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='latitude'>Latitude</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='longitude'>Longitude</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='distance'>Leg Distance</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='delete' dataFormat={this.deleteFunc }>Delete</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='origin' dataFormat={this.makeOriginFunc}>Make Origin</TableHeaderColumn>
                            <TableHeaderColumn width='150' dataField='change' dataFormat={this.renderDropDown}>Change Order</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                }
            />
        );
    }

    renderDropDown() {
        return (
            <UncontrolledButtonDropdown>
                <DropdownToggle caret size="lg">
                    Large Button
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>Another Action</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        );
    }


    reverseList(){
        return(
            <button>Reverse</button>
        )
    }

    deleteFunc(cell, row, enumObject, index){
        return (
            <button onClick={() => this.props.deleteLocation(index)}>Delete</button>
        );
    }

    makeOriginFunc(cell, row, enumObject, index){
        return (
            <button onClick={() => this.props.changeStartLocation(index)}>Make Origin</button>
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
