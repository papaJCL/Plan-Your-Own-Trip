import React, { Component } from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { Row, Col, Button, ButtonGroup } from 'reactstrap'

{/* This code uses source code from https://blog.campvanilla.com/reactjs-dropdown-menus-b6e06ae3a8fe in order to parse drop down menus*/}

export default class CustomUnits extends Component {
    constructor() {
        super()

        this.state = {
            showMenu: false,
        }

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    showMenu(event) {
        event.preventDefault();

        this.setState({ showMenu: true}, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu(event) {

        if (!this.dropdownMenu.contains(event.target)) {


            this.setState({showMenu: false}, () => {
                document.removeEventListener('click', this.closeMenu);
            });

        }
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
                <button className='btn-csu w-100 text-left' onClick={this.showMenu}>
                    Show menu
                </button>

                {
                    this.state.showMenu
                        ? (
                            <div
                                className="menu"
                                ref={(element) => {
                                    this.dropdownMenu = element;
                                }}
                            >
                                <button> Test 1</button>
                                <button> Test 2</button>
                                <button> Test 3</button>
                            </div>
                        )
                        : (
                            null
                        )
                }
            </div>
        );
    }
}