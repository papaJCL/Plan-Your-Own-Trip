import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane';
import {Button, ButtonGroup } from 'reactstrap'
import { Card, CardHeader, CardBody } from 'reactstrap'
import {converter} from 'json-2-csv'

export default class Convert extends Component {
    constructor(props) {
        super(props);
        this.buttonCSV = this.buttonCSV.bind(this);
    }

    render() {
        return (
        <Card className='text-center'>
            <CardHeader className='bg-csu-gold text-white font-weight-semibold'>Download Itinerary</CardHeader>
            <CardBody>
                <Button onClick={this.buttonCSV}>Download Itinerary in CSV Format</Button>
            </CardBody>
        </Card>
        );

    }

    buttonCSV() {
        let csv = this.convertToCSV(JSON.stringify(this.props.JSONString.body.places));
        this.download(csv, '.csv');
    }

    download(csv, strFileType) {
        var fileName = 'my Trip' + strFileType;
        var contentType = 'text/plain';
        var a = document.createElement("a");
        var file = new Blob([csv], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    // From Hemant Metalia on Stack Overflow
    convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
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
        console.log(str);
        let newstr = 'Name, ID, Latitude, Longitude' + ((Object.keys(this.props.JSONString.body.places[0]).length === 5) ? ', Altitude' : '') + 'Leg Distance\n' + str;
        let lines = newstr.split('\n');
        for (let i = 1; i < lines.length; i++) {
                lines[i] += ', ' + this.props.JSONString.body.distances[i -1];
        }
        newstr = lines.join();
        return newstr;
    }

}