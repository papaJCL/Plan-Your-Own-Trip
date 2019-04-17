import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import Pane from '../Pane';
import {Button, ButtonGroup } from 'reactstrap'
import { Card, CardHeader, CardBody } from 'reactstrap'

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
        let csv = this.convertToCSV(JSON.stringify(this.props.JSONString.body));
        this.download(csv);
    }

    download(csv) {
        var fileName = 'my Trip';
        var contentType = 'text/plain';
        var a = document.createElement("a");
        var file = new Blob([csv], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }
}