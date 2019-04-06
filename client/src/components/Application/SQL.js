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
        /*
        this.renderItinerary = this.renderItinerary.bind(this)
        this.basicItinerary = this.basicItinerary.bind(this)
        this.deleteFunc = this.deleteFunc.bind(this)
        this.makeOriginFunc = this.makeOriginFunc.bind(this)
        this.changeFunc = this.changeFunc.bind(this)
        this.addCols =this.addCols.bind(this)
        this.convertUnitsToNum = this.convertUnitsToNum.bind(this)
        */
        this.SQLMenu = this.SQLMenu.bind(this);
    }

    render() { console.log('I am in render for SQL.js')
        return (
            <div>
                {this.SQLMenu()}
            </div>
        )

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

    SQLBody(){ console.log('I am in SQLBody --- SQLJSON: ', this.props.SQLJson)
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

    callNewItineraryWithSQL(work){
        //this.props.addLocation(work.name, work.latitude, work.longitude);
        return (this.props.updateItinerarySQL(work));
    }



}