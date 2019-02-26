import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Container, Input} from 'reactstrap';

import Home from './Home';
import Options from './Options/Options';
import About from './About/About';
import Calculator from './Calculator/Calculator';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest, sendServerRequestWithBody} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';


/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props){
    super(props);

    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);

    this.state = {
      serverConfig: null,
      planOptions: {
        units: {'miles':3959 , 'kilometers' : 6371 , 'nautical miles' : 3440},
        activeUnit: 'miles'
      },
      clientSettings: {
        serverPort: getOriginalServerPort()
      },
      origin: {latitude: '', longitude: ''},
      destination: {latitude: '', longitude: ''},
      distance: 0,
      errorMessage: null
    };
    this.updateServerConfig();
  }

  render() {

    let pageToRender = this.state.serverConfig ? this.props.page : 'settings';

    return (
        <div className='application-width'>
          { this.state.errorMessage }{ this.createApplicationPage(pageToRender) }
        </div>
    );
  }

  updateClientSetting(field, value) {
    if(field === 'serverPort')
      this.setState({clientSettings: {serverPort: value}}, this.updateServerConfig);
    else {
      let newSettings = Object.assign({}, this.state.planOptions);
      newSettings[field] = value;
      this.setState({clientSettings: newSettings});
    }
  }

  updatePlanOption(option, value) {
    let optionsCopy = Object.assign({}, this.state.planOptions);
    optionsCopy[option] = value;
    this.setState({'planOptions': optionsCopy});
  }

  updateServerConfig() {
    sendServerRequest('config', this.state.clientSettings.serverPort).then(config => {
      console.log(config);
      this.processConfigResponse(config);
    });
  }

  createErrorBanner(statusText, statusCode, message) {
    return (
        <ErrorBanner statusText={statusText}
                     statusCode={statusCode}
                     message={message}/>
    );
  }

  createApplicationPage(pageToRender) {
    switch(pageToRender) {
      case 'calc':
        return <Calculator options={this.state.planOptions}
                           distance = {this.state.distance}
                           settings={this.state.clientSettings}
                           createErrorBanner={this.createErrorBanner}
                           calculateDistance = {this.calculateDistance}
                           createInputField = {this.createInputField}
                           updateLocationOnChange = {this.updateLocationOnChange}/>;
      case 'options':
        return <Options options={this.state.planOptions}
                        config={this.state.serverConfig}
                        updateOption={this.updatePlanOption}/>;
      case 'settings':
        return <Settings settings={this.state.clientSettings}
                         serverConfig={this.state.serverConfig}
                         updateSetting={this.updateClientSetting}/>;

      case 'about':
        return <About about={this.state.planOptions}
                      config={this.state.serverConfig}
                      updateOption={this.updatePlanOption}/>;

      default:
        return <Home/>;
    }
  }

  processConfigResponse(config) {
    if(config.statusCode >= 200 && config.statusCode <= 299) {
      console.log("Switching to server ", this.state.clientSettings.serverPort);
      this.setState({
        serverConfig: config.body,
        errorMessage: null
      });
    }
    else {
      this.setState({
        serverConfig: null,
        errorMessage:
            <Container>
              {this.createErrorBanner(config.statusText, config.statusCode,
                  `Failed to fetch config from ${ this.state.clientSettings.serverPort}. Please choose a valid server.`)}
            </Container>
      });
    }
  }

  calculateDistance() {
    const tipConfigRequest = {
      'type'        : 'distance',
      'version'     : 1,
      'origin'      : this.state.origin,
      'destination' : this.state.destination,
      'earthRadius' : this.state.planOptions.units[this.state.planOptions.activeUnit]
    };

    sendServerRequestWithBody('distance', tipConfigRequest, this.state.clientSettings.serverPort)
        .then((response) => {
          if(response.statusCode >= 200 && response.statusCode <= 299) {
            this.setState({
              distance: response.body.distance,
              errorMessage: null
            });
          }
          else {
            this.setState({
              errorMessage: this.state.createErrorBanner(
                  response.statusText,
                  response.statusCode,
                  `Request to ${ this.state.clientSettings.serverPort } failed.`
              )
            });
          }
        });
  }

  updateLocationOnChange(stateVar, field, value) {
    var DMS = "^([0-8]?[0-9]|90)°(\s[0-5]?[0-9]\')?(\s[0-5]?[0-9](,[0-9])?\")?$";
    if(value == DMS) {   // This if statement finds out if the value in the field is in DMS form and if so changes it to decimal
      var convertDMSToDegrees = value.split("\s|\'| \"");
    }
    let location = Object.assign({}, this.state[stateVar]);
    location[field] = value;
    this.setState({[stateVar]: location});
  }

  createInputField(stateVar, coordinate) {
    let updateStateVarOnChange = (event) => {
      this.updateLocationOnChange(stateVar, event.target.name, event.target.value)};

    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
    return (
        <Input name={coordinate} placeholder={capitalizedCoordinate}
               id={`${stateVar}${capitalizedCoordinate}`}
               value={this.state[stateVar][coordinate]}
               onChange={updateStateVarOnChange}
               style={{width: "100%"}} />
    );

  }

}

