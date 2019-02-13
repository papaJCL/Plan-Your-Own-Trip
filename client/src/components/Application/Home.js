import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'

/*
 * Renders the home page.
 */
export default class Home extends Component {

    render() {
        return (
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                        {this.renderMap()}
                    </Col>
                    <Col xs={12} sm={12} md={5} lg={4} xl={3}>
                        {this.renderIntro()}
                    </Col>
                </Row>
            </Container>
        );
    }

    renderMap() {
        return (
            <Pane header={'Where Am I?'}
            bodyJSX={this.renderLeafletMap()}
            />
        );
    }

    renderLeafletMap() {
        return (
            <div>
                {this.renderTest()}
                <Map center={[40.576179, -105.080773]} zoom={10} setView={true}
                style={{height: 500, maxwidth: 700}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={[40.576179, -105.080773]}
                        icon={this.markerIcon()}>
                        <Popup className="font-weight-extrabold">Colorado State University</Popup>
                    </Marker>
                </Map>
        </div>
        );
    }

    renderTest(){
        // return (
        //     <div>
        //     //{setView: true, maxZoom: 16}
        //     </div>
        // );
    }

    renderIntro() {
        return(
            <Pane header={'Bon Voyage!'}
            bodyJSX={'Let us help you plan your next trip.'}
            />
        );
    }

    markerIcon() {
        // react-leaflet does not currently handle default marker icons correctly,
        // so we must create our own
        return L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }
}