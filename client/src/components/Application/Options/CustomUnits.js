import React, { Component } from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { Row, Col, Button, ButtonGroup } from 'reactstrap'

{/* This code uses source code from https://blog.campvanilla.com/reactjs-dropdown-menus-b6e06ae3a8fe in order to parse drop down menus*/}

export default class CustomUnits extends Component {
    constructor() {
        super()
    }

    render() {
        return(
            <Card className='text-center'>
                <CardHeader className='bg-csu-gold text-white font-weight-semibold'>Custom Units</CardHeader>
                <CardBody>
                    <ButtonGroup vertical className='w100'>
                        {this.renderDropDownMenu()}
                    </ButtonGroup>
                </CardBody>
            </Card>
        );
    }

    renderDropDownMenu() {
        return (
            <div>
                <button>
                    Show menu
                </button>

                <div className="menu">
                    <button> Test 1 </button>
                    <button> Test 2 </button>
                    <button> Test 3 </button>
                </div>
            </div>
        );
    }

    }