import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane';
import jeremy from './jeremy.png'
import darien from './darien.png'
import Griffin from './Griffin.png'
import edward from './edward.png'
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle } from 'reactstrap';

//import Units from './Options/Units'

/* Options allows the user to change the parameters for planning
 * and rendering the trip map and itinerary.
 * The options reside in the parent object so they may be shared with the Distance object.
 * Allows the user to set the options used by the application via a set of buttons.
 */
export default class About extends Component{
    render() {
        return(
            <Container>
            <Row>
            <Col xs={12}>
            {this.createHeader()}
    </Col>
        </Row>
        <Row>
        <Col  xs={12} sm={6}>
            {this.createFunction('Griffin Gilbert')}
    </Col>
        <Col xs={12} sm={6}>
            {this.createFunction('Jeremy Lesser')}
    </Col>
        </Row>
        <Row>
        <Col xs={12} sm={6}>
            {this.createFunction(`Edward Pike`)}
    </Col>
        <Col  xs={12} sm={6}>
            {this.createFunction(`Darien Cupit`)}
    </Col>
        </Row>
        </Container>
    )
    }

    createFunction(person){
        return (
            <Pane header={person}
        bodyJSX={
            <div>
            <Row>
            <Col  xs={12} sm={6}>
            <Col  xs={12} sm={14}>
            {this.getImage(person)}
    </Col>
        </Col>


        <Col  xs={12} sm={6}>
            <Card>
            {this.getBlurb(person)}
    </Card>
        </Col>
        </Row>
        </div>}/>
    );

    }

    getImage(person){
        switch(person){
            case `Griffin Gilbert`:
                return(
                    <img src={Griffin}/>
            );
            case `Jeremy Lesser`:
                return(
                    <img src={jeremy}/>
            );
            case `Edward Pike`:
                return(
                    <img src={edward}/>
            );
            case `Darien Cupit`:
                return(
                    <img src={darien}/>
            );
            default:
                return;
        }

    }



    getBlurb(person){
        switch(person){
            case 'Griffin Gilbert':
                return(
                    this.getBGilbert()
                );


            case 'Jeremy Lesser':
                return(
                    this.getBLesser()
                );

            case 'Edward Pike':
                return(
                    this.getBPike()
                );
            case 'Darien Cupit':
                return(
                    this.getBCupit()
                );
            default:
                return;
        }
    }


    createHeader() {
        return (
            <Pane header={'About us'}
        bodyJSX={
            <div>
            We are a familiy friendly small buisiness trying to make a big impact in the world
        of trip management. We hope to change the way you plan trips online and for free!
            Below are the members of our team, who are dedicated to making this company a success.
        </div>}/>
    );
    }

    getBGilbert(){
        return(
            <span>
            I am a third year computer science student at CSU. I am an Army ROTC cadet
        and a member of our school secruity club, Hashdump. Born in California and
        raised in Colorado I enjoy skiing, fishing, and playing sports. I am an avid
        reader and play too many video games for my own good.
        </span>
    );
    }

    getBCupit(){
        return(
            <span>
            I am a third-year Computer Science student and AROTC cadet at Colorado State University.
            My work experience before college involved network administration at our family's
        business. While this wasn't an arduous job, it is what got me interested in working on
        computers. When it came time to decided on a university, I decided to become a student
        at CSU due to its amazing Computer Science and ROTC programs, and have since gained many
        incredibly useful experiences and skills.
        </span>
    );
    }
    getBPike(){
        return(
            <span>
            I am a computer science major in my last year of school at CSU.  I was born
        and raised in Chicago, IL and originally attended UIUC as a physics major,
            and transferred after 2 years. My hobbies consist of playing with my doggo,
            playing with other doggos, and anything else related to heckin' good bois.
        </span>
    );
    }
    getBLesser(){
        return(
            <span>
            I am a fourth year Computer Science Major. I was raised in Erie Colorado. My hobbies include
        skiing, hiking, and video games.
        </span>
    );
    }
}