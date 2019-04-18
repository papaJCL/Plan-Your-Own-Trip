import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';
import App from '../src/components/App';


const pages = [
    { title: 't11 Ultra Super Team Delta', page: ''},
    {title: 'SQL', page: 'sql'},
    { title: 'Calculator', page: 'calc'},
    { title: 'Options', page: 'options'},
    { title: 'About', page: 'about'},
    { title: '\u2699', page: 'settings' }
];


function testRender(){
    const app = shallow(<App/>)
    // app.instance().setAppPage();
    // app.update();
    app.setState({ current_page: pages[1] });
    expect(app.state().current_page).toEqual(pages[1])

    let numberOfHeaders = app.find('Header').length;
    expect(numberOfHeaders).toEqual(1)

    app.instance().setAppPage(pages[2])
    app.update();
    expect(app.state().current_page).toEqual(pages[2])
}

test("Testing basic state and render" , testRender)