import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';

export default class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            origin: {latitude: '', longitude: ''},
            destination: {latitude: '', longitude: ''},
            distance: 0,
            errorMessage: null
        };

        this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
        this.calculateDistance = this.calculateDistance.bind(this);
        this.checkData = this.checkData.bind(this);
        this.createInputField = this.createInputField.bind(this);

    }

    render() {
        return (
            <Container>
                { this.state.errorMessage }
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

    createInputField(stateVar, coordinate) {
        let updateStateVarOnChange = (event) => {
            this.updateLocationOnChange(stateVar, event.target.name, event.target.value)};

        let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
        return (
            <Input name={coordinate} placeholder={capitalizedCoordinate}
                   id={`${stateVar}${capitalizedCoordinate}`}
                   value={this.state[stateVar][coordinate]}
                   onChange={updateStateVarOnChange}
                   style={{width: "100%"}} />
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
                          <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
                          <Button onClick={this.calculateDistance}>Calculate</Button>
                      </div>}
            />
        );
    }

    /* The code below uses the magellan-coords library by dbarbalato at www.npmjs.com*/
    checkData() {
        var magellan = require('./../../../../../node_modules/magellan-coords/magellan');

        if (
            magellan(this.state.origin.latitude).latitude() === null ||
            magellan(this.state.origin.longitude).longitude() === null ||
            magellan(this.state.destination.latitude).latitude() === null ||
            magellan(this.state.destination.longitude).longitude() === null
        ) {{
            /* Error: Invalid Input */

            this.setState({
                errorMessage: this.props.createErrorBanner(
                    'Error',
                    '500',
                    `Invalid Input Entered Into Origin or Destination`
                )});
        }


        }
    }

    calculateDistance() {
        this.checkData();
        var magellan = require('./../../../../../node_modules/magellan-coords/magellan');
        const tipConfigRequest = {
            'type'        : 'distance',
            'version'     : 2,
            'origin'      : {latitude: magellan(this.state.origin.latitude).latitude().toDD(), longitude: magellan(this.state.origin.longitude).longitude().toDD()},
            'destination' : {latitude: magellan(this.state.destination.latitude).latitude().toDD(), longitude: magellan(this.state.destination.longitude).longitude().toDD()},
            'earthRadius' : this.props.options.units[this.props.options.activeUnit]
        };

        sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
            .then((response) => {
                if(response.statusCode >= 200 && response.statusCode <= 299) {
                    this.setState({
                        distance: response.body.distance,
                        errorMessage: null
                    });
                }
                else {
                    this.setState({
                        errorMessage: this.props.createErrorBanner(
                            response.statusText,
                            response.statusCode,
                            `Request to ${ this.props.settings.serverPort } failed.`
                        )
                    });
                }
            });
    }

    updateLocationOnChange(stateVar, field, value) {
        let location = Object.assign({}, this.state[stateVar]);
        location[field] = value;
        this.setState({[stateVar]: location});
    }

}