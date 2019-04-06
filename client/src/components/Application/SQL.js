import React, {Component} from 'react';
import {Container, Row, Col, Button} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle , Table} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Form, Label, Input  } from 'reactstrap';
import BootstrapTable1 from 'react-bootstrap-table-next';
import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit';
import { sendServerRequestWithBody } from '../../api/restfulAPI'


export default class SQL extends Component {
    constructor(props) {
        super(props)
        this.SQLMenu = this.SQLMenu.bind(this);
        //this.returnSQLItinerary = this.returnSQLItinerary.bind(this);
    }

    render() { console.log('I am in render for SQL.js')
        return (
            <div>
                {this.SQLMenu()}
            </div>
        )

    }

    varBody(){ console.log('I am in varBody')
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

    SQLBody(){ console.log('I am in SQLBody --- SQLJSON: ', this.props.SQLJson)
        if (this.props.SQLJson.places == null) return;
        else{ return( this.varBody());
        }
    }

    buttonSQL(idx){ console.log('I am in buttonSQL')
        let work = this.props.SQLJson.places[idx]
        return(
            <button onClick={() => this.callNewItineraryWithSQL(work) }>Add to Itinerary</button>
        );
    }

    SQLMenu(){ console.log('I am in SQLMenu --- SQLJSON; ', this.props.SQLJson)
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

    callNewItineraryWithSQL(work){ console.log('button pressed: callNewItineraryWithSQL - work: ', work)
        //this.props.addLocation(work.name, work.latitude, work.longitude);
        return (this.props.updateItinerarySQL(work));
    }

/*
        finalizeSQLItinerary(){ console.log('finalizeSQLItinerary')
            return (
                <button onClick={() => this.sendSQLRequest()}>Click this when SQL Itinerary is done</button>
            );
        }

        sendSQLRequest(){
            console.log("sendSQLRequest")
            console.log(this.props.JSONString.body)
            console.log(this.props.planOptions.activeUnit)
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

        SQLProducts(){ console.log('SQLProducts: ', this.props.SQLItineraryInfo)
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

        returnSQLItinerary(){
            var products = this.SQLProducts();
            var cols = this.SQLColumns();
            console.log('products; ', products)
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
    */


}