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
    }

    render() {
        return (
        <Card className='text-center'>
            <CardHeader className='bg-csu-gold text-white font-weight-semibold'>Download Itinerary</CardHeader>
            <CardBody>
                <ButtonGroup>
                    <Button onClick={this.buttonJSON}>Download Itinerary in JSON Format</Button>
                    <Button onClick={this.buttonCSV}>Download Itinerary in CSV Format</Button>
                </ButtonGroup>
            </CardBody>
        </Card>
        );

    }

    buttonJSON() {
        this.download(JSON.stringify(this.props.returnFile), '.json');
    }

    buttonCSV() {
        let csv = this.convertToCSV(JSON.stringify(this.props.JSONString.body.places));
        this.download(csv, '.csv');
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