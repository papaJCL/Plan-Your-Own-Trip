import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';

export default class Calculator extends Component {
    constructor(props) {
        super(props);

        // this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
        // this.calculateDistance = this.calculateDistance.bind(this);
        //this.props.createInputField = this.props.createInputField.bind(this);



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

    updateProps(){
        this.props.plan
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
                          {this.props.createInputField(stateVar, 'latitude')}
                          {this.props.createInputField(stateVar, 'longitude')}
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
                          <Button onClick={this.props.calculateDistance}>Calculate</Button>
                      </div>}
            />
        );
    }


}