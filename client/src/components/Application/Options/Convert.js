import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane';
import {Button, ButtonGroup } from 'reactstrap'
import { Card, CardHeader, CardBody } from 'reactstrap'

export default class Convert extends Component {
    constructor(props) {
        super(props);
        this.buttonCSV = this.buttonCSV.bind(this);
        this.buttonJSON = this.buttonJSON.bind(this);
        this.buttonKML = this.buttonKML.bind(this);
    }

    render() {
        return (
        <Card className='text-center'>
            <CardHeader className='bg-csu-gold text-white font-weight-semibold'>Download Itinerary</CardHeader>
            <CardBody>
                <ButtonGroup vertical>
                    <Button onClick={this.buttonJSON}>JSON Format </Button>
                    <Button onClick={this.buttonCSV}>CSV Format</Button>
                    <Button onClick={this.buttonKML}>KML Format</Button>
                </ButtonGroup>
            </CardBody>
        </Card>
        );

    }

    buttonJSON() {
        this.download(JSON.stringify(this.props.JSONString.body), '.json');
    }

    buttonCSV() {
        let csv = this.convertToCSV(JSON.stringify(this.props.JSONString.body.places));
        this.download(csv, '.csv');
    }

    buttonKML() {
        let kml = this.convertToKML(JSON.stringify(this.props.JSONString.body.places))
        this.download(kml, '.kml');
    }

    download(object, strFileType) {
        var fileName = 'my Trip' + strFileType;
        var contentType = 'text/plain';
        var a = document.createElement("a");
        var file = new Blob([object], {type: contentType, endings: 'native'});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    convertToKML(objArray) {
        let kml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n" +
            "  <Document>\n" +
            "    <name>My Trip</name>\n" +
            "    <open>1</open>\n" +
            "    <description>You're Itinerary</description>\n" +
            "    <Style id=\"CrossStyle\">\n" +
            "      <LineStyle>\n" +
            "        <color>ffffffb6</color>\n" +
            "        <width>4</width>\n" +
            "      </LineStyle>\n" +
            "    </Style>";
        for (let i = 0; i < objArray.length - 1; i++) {
            kml += "<Placemark>\n" +
                "      <name>Cross-corner line</name>\n" +
                "      <styleUrl>#CrossStyle</styleUrl>\n" +
                "      <LineString>\n" +
                "        <coordinates>" + this.props.JSONString.body.places[i].longitude + "," + this.props.JSONString.body.places[i].latitude + "\n" +
                this.props.JSONString.body.places[i + 1].longitude + "," + this.props.JSONString.body.places[i + 1].latitude + "</coordinates>\n" +
                "      </LineString>\n" +
                "    </Placemark>";
        }

        kml += "  </Document>\n" +
            "</kml>";
    return kml;

    }

    // From Hemant Metalia on Stack Overflow
    convertToCSV(objArray) {
        var array = JSON.parse(objArray);
        var str = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ',';

                line += array[i][index];
            }
            str += line + '\r\n';
        }
        str = this.addHeaderAndDistance(str);
        return str;
    }

    addHeaderAndDistance(str) {
        let newstr = 'Name,ID,Latitude,Longitude' + ((Object.keys(this.props.JSONString.body.places[0]).length === 5) ? ',Altitude' : '') + ',Leg Distance\n' + str;
        let lines = newstr.split('\n');
        lines.splice(-1, 1)
        for (let i = 1; i < lines.length; i++) {
            lines[i] = lines[i].substring(0, lines[i].length - 1)
            lines[i] += ',' + this.props.JSONString.body.distances[i - 1] + '\n';
        }
        newstr = '';
        lines[0] += '\n';
        for (let i = 0; i < lines.length; i++)
           newstr += lines[i];
        return newstr;
    }

}