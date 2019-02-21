import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);

    this.state = {
        origin: {latitude: '', longitude: ''},
        destination: {latitude: '', longitude: ''},
        distance: 0,
        errorMessage: null
    };
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

  updateProps(){
    this.props.plan
  }

  createHeader() {
    return (
        <Pane header={'Calculator'}
              bodyJSX={<div>Determine the distance between the origin and destination.
                Change the units on the <b>Options</b> page.</div>}/>
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

    calculateDistance() {
        this.checkData();  //makes sure data sent to server is "Good"
        const tipConfigRequest = {
            'type'        : 'distance',
            'version'     : 1,
            'origin'      : this.state.origin,
            'destination' : this.state.destination,
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

    checkData(){  // does 3 things, checks for DMS and converts to decimal
        // Checks for W & S and puts - in front of field
        // Makes sure valid coordinates were put in.

        /*
        console.log("hi into data");
        this.state.origin.latitude = this.checkNorthSouthEastWest(this.state.origin.latitude);
        this.state.origin.longitude = this.checkNorthSouthEastWest(this.state.origin.longitude);
        this.state.destination.latitude = this.checkNorthSouthEastWest(this.state.destination.latitude);
        this.state.destination.longitude = this.checkNorthSouthEastWest(this.state.destination.longitude);
        console.log("hi out of data");
        */
        this.checkRange(); // checks to make sure coordinates are valid
    }

    checkNorthSouthEastWest(value){
        for (var i= 0; i <value.length; i++){
            console.log("into for loop");
            var looking = value[i];
            var negOrPos = '';
            console.log("into if statements");
            if(looking === 'S' | looking === 's'){
                negOrPos = '-';
                //value[i] = '';
            }
            if(looking === 'W' | looking === 'w'){
                console.log("doing something with test case 'W'");
                negOrPos = '-';
                //value[i] = '';
                console.log("did something with test case 'W'");
            }

        }
        value = negOrPos + value;
        console.log("value at point");
        console.log(value);
        return(value);
    }

    checkRange(){

        if(this.state.origin.latitude < -90 | this.state.origin.latitude > 90){
            throw new Error("the origin latitude is out of bounds.")
        }
        if(this.state.destination.latitude < -90 | this.state.destination.latitude > 90){
            this.setState({
                errorMessage: this.props.createErrorBanner(
                    response.statusText,
                    response.statusCode,
                    `the destination latitude, ${this.state.destination.latitude } is not valid`
                )
            });
        }
        if(this.state.origin.longitude < -180 | this.state.origin.longitude > 180){
            this.setState({
                errorMessage: this.props.createErrorBanner(
                    response.statusText,
                    response.statusCode,
                    `the origin longitude, ${this.state.origin.longitude } is not valid`
                )
            });
        }
        if(this.state.destination.longitude < -180 | this.state.destination.longitude > 180){
            this.setState({
                errorMessage: this.props.createErrorBanner(
                    response.statusText,
                    response.statusCode,
                    `the destination longitude, ${this.state.destination.longitude } is not valid`
                )
            });
        }

    }

}