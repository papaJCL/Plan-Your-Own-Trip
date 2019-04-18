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
        var magellan = require('./../../../../../node_modules/magellan-coords/magellan');
        if (
            magellan(this.props.origin.latitude).latitude() === null ||
            magellan(this.props.origin.longitude).longitude() === null ||
            magellan(this.props.destination.latitude).latitude() === null ||
            magellan(this.props.destination.longitude).longitude() === null
        ) {
            {
                /* Error: Invalid Input */
                this.props.createErrorBannerState('Error', '500', `Invalid Input Entered Into Origin or Destination`);
                return false;
            }
        }
        else return true;
    }


    calculateDistance() {
        if (this.checkData() === false) return;
        var magellan = require('./../../../../../node_modules/magellan-coords/magellan');
        const tipConfigRequest = {
            'requestType'        : 'distance',
            'requestVersion'     : 1,
            'origin'      : {latitude: magellan(this.props.origin.latitude).latitude().toDD(), longitude: magellan(this.props.origin.longitude).longitude().toDD()},
            'destination' : {latitude: magellan(this.props.destination.latitude).latitude().toDD(), longitude: magellan(this.props.destination.longitude).longitude().toDD()},
            'earthRadius' : this.props.options.units[this.props.options.activeUnit]
        };

        sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
            .then((response) => {
            if(response.statusCode >= 200 && response.statusCode <= 299) {
            this.props.updateIfGoodCalculator(response)
        }
    else {
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