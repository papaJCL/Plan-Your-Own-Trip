import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane';
//import Units from './Options/Units'

/* Options allows the user to change the parameters for planning
 * and rendering the trip map and itinerary.
 * The options reside in the parent object so they may be shared with the Distance object.
 * Allows the user to set the options used by the application via a set of buttons.
 */
export default class About extends Component{
    constructor(props) {
        super(props);
    }


    render() {
        return(
            <Container>
                <Row>
                    <Col xs="12">
                    {this.createHeader()}
                    </Col>
                </Row>
            
            </Container>
        )
    }


    createHeader() {
        return (
            <Pane header={'About us'}
        bodyJSX={<div>We are a familiy friendly small buisiness trying to make a big impact in the world of trip management.
         We hope to change the way you plan trips online and for free! Below are the members of our team, who are dedicated
        to making this company a success</div>}/>
    );
    }

}
