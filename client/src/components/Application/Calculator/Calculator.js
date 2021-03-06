import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';


export default class Calculator extends Component {
    constructor(props) {
        super(props);
        this.calculateDistance = this.calculateDistance.bind(this);
    }

    render() {
        return (
            <Container>
            { this.props.errorMessage }
            <Row>
            <Col>
            {this.createHeader()}
            </Col>
            </Row>
            <Row>
            <Col xs={12} sm={6} md={4} lg={3}>
            {this.createForm('origin')}
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
            {this.createForm('destination')}
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
            {this.createDistance()}
            </Col>
            </Row>
            </Container>
    );
    }


    createHeader() {
        return (
            <Pane header={'Calculator'}
        bodyJSX={<div>Determine the distance between the origin and destination. The calculator will accept most
        coordinate formats. If the one you have is invalid, an error will appear a the top of the page.
            You can Change the units on the <b>Options</b> page.</div>}/>
    );
    }

    createForm(stateVar) {
        return (
            <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
        bodyJSX={
            <Form >
            {this.createInputField(stateVar, 'latitude')}
        {this.createInputField(stateVar, 'longitude')}
    </Form>
    }
        />);
    }

    createDistance() {
        return(
            <Pane header={'Distance'}
        bodyJSX={
            <div>
            <h5>{this.props.distance} {this.props.options.activeUnit}</h5>
        <Button onClick={this.calculateDistance}>Calculate</Button>
            </div>}
        />
    );
    }

    checkData() {
        var Coordinates = require('coordinate-parser');
        try {
            let ocoords = new Coordinates(this.props.origin.latitude + ' ' + this.props.origin.longitude);
            let dcoords = new Coordinates(this.props.destination.latitude + ' ' + this.props.destination.longitude);
        }
        catch (error) {
            this.props.createErrorBannerState('Error', '500', `Invalid Input Entered Into Origin or Destination`);
            return false;
        }
    }


    calculateDistance() {
        if (this.checkData() === false) return;
       var Coordinates = require('coordinate-parser');
        let originCoords = new Coordinates(this.props.origin.latitude + ' ' + this.props.origin.longitude);
        let destinationCoords = new Coordinates(this.props.destination.latitude + ' ' + this.props.destination.longitude);
       const tipConfigRequest = {
       'requestType'        : 'distance',
       'requestVersion'     : 1,
       'origin'      : {latitude: originCoords.getLatitude() + '', longitude: originCoords.getLongitude() + ''},
       'destination' : {latitude: destinationCoords.getLatitude() + '', longitude: destinationCoords.getLongitude() + ''},
       'earthRadius' : this.props.options.units[this.props.options.activeUnit]
       };

        sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
            .then((response) => {
            var valid = this.props.checkServerResponse(response.statusCode,response.body, 'distance')
                if(valid){
                    this.props.updateIfGoodCalculator(response)
                }else {
                    this.props.createErrorBannerState(response.statusText, response.statusCode, `Request to ${ this.props.settings.serverPort } failed.`);
        }
    });
    }


    createInputField(stateVar, coordinate) {
        let updateStateVarOnChange = (event) => {
            this.updateLocationOnChange(stateVar, event.target.name, event.target.value)};

        let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
        return (
            <Input name={coordinate} placeholder={capitalizedCoordinate}
        id={`${stateVar}${capitalizedCoordinate}`}
        value={this.props[stateVar][coordinate]}
        onChange={updateStateVarOnChange}
        style={{width: "100%"}} />
    );

    }

    updateLocationOnChange(stateVar, field, value) {
        let location = Object.assign({}, this.props[stateVar]);
        location[field] = value;
        //this.setState({[stateVar]: location});
        this.props.setValue(stateVar, location)
    }



}