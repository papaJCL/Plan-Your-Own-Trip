import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Container, Input} from 'reactstrap';
import Home from './Home';
import Options from './Options/Options';
import About from './About/About';
import Calculator from './Calculator/Calculator';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest, sendServerRequestWithBody} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';
/*import {latitude} from './../../../../node_modules/magellan-coords/magellan';*/

/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props){
    super(props);

    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.createErrorBanner = this.createErrorBanner.bind(this);
    this.updatecheckData = this.updatecheckData.bind(this);
    this.updateIfGoodCalculator = this.updateIfGoodCalculator.bind(this);
    this.updateIfBadCalculator = this.updateIfBadCalculator.bind(this);
    this.processConfigResponse = this.processConfigResponse.bind(this);
    this.setValue = this.setValue.bind(this);
    this.clearMapState = this.clearMapState.bind(this);
    this.reRenderNewMapState = this.reRenderNewMapState.bind(this);
    this.liftHomeState = this.liftHomeState.bind(this);
    this.updatePlacesArray = this.updatePlacesArray.bind(this);
    this.deleteError = this.deleteError.bind(this);
    this.updateOldUnit = this.updateOldUnit.bind(this)

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
        errorMessage: null,
        JSONString: [],
        returnFile: [],
        latitude: [],
        longitude: [],
        markers: [[]],
        boolMarker: false ,
        polyLineCoor: [[]],
        names : [] ,
        oldUnits : '',
        origUnit: ''

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

  updateOldUnit(){
      this.setState({
            oldUnits: this.state.planOptions.activeUnit
        })
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
        return <Calculator
            options={this.state.planOptions}
            distance = {this.state.distance}
            settings={this.state.clientSettings}
            origin = {this.state.origin}
            destination = {this.state.destination}
            planOptions = {this.state.planOptions}
            createErrorBanner={this.createErrorBanner}
            updateLocationOnChange = {this.updateLocationOnChange}
            updatecheckData = {this.updatecheckData}
            updateIfBadCalculator = {this.updateIfBadCalculator}
            updateIfGoodCalculator = {this.updateIfGoodCalculator}
            setValue = {this.setValue}
            />;
      case 'options':
        return <Options
            options={this.state.planOptions}
            config={this.state.serverConfig}
            oldUnits = {this.state.oldUnits}
            updateOldUnit = {this.updateOldUnit}
            updateOption={this.updatePlanOption}/>;
      case 'settings':
        return <Settings
            settings={this.state.clientSettings}
            serverConfig={this.state.serverConfig}
            updateSetting={this.updateClientSetting}/>;

      case 'about':
        return <About
            about={this.state.planOptions}
            config={this.state.serverConfig}
            updateOption={this.updatePlanOption}/>;

      default:
        return <Home
            clientSettings = {this.state.clientSettings}
            clearMapState = {this.clearMapState}
            reRenderNewMapState = {this.reRenderNewMapState}
            markers = {this.state.markers}
            JSONString = {this.state.JSONString}
            returnFile = {this.state.returnFile}
            latitude = {this.state.latitude}
            longitude = {this.state.longitude}
            boolMarker = {this.state.boolMarker}
            polyLineCoor = {this.state.polyLineCoor}
            names = {this.state.names}
            liftHomeState = {this.liftHomeState}
            updatePlacesArray = {this.updatePlacesArray}
            deleteError = {this.deleteError}
            planOptions = {this.state.planOptions}
            oldUnits = {this.state.oldUnits}
            origUnit = {this.state.origUnit}
            ref="child"
            />;
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


  updatecheckData(){
    this.setState({
      errorMessage: this.createErrorBanner('Error', '500',
          `Invalid Input Entered Into Origin or Destination`)
    });
  }

  deleteError() {
      this.setState({
          errorMessage: this.createErrorBanner('Error', '500',
              `You Must Have At least Two Locations For the Itinerary`)
      });
  }

  updateIfGoodCalculator(response){
    this.setState({
      distance: response.body.distance,
      errorMessage: null
    });
  }

  updateIfBadCalculator(response){
    this.setState({
      errorMessage: this.createErrorBanner(
          response.statusText,
          response.statusCode,
          `Request to ${ this.state.clientSettings.serverPort } failed.`
      )
    });
  }


  setValue(stateVar, location){
    this.setState({[stateVar]: location});
  }

  clearMapState(){
    this.setState({
      JSONString: [] ,
      returnFile: [],
      latitude: [],
      longitude: [],
      markers: [[]],
      boolMarker: false ,
      names: [],
      origUnit: 0
    });
  }

  reRenderNewMapState(latitude, longitude, names, polyLine, markers){
      this.setState({
          latitude: latitude,
          longitude: longitude,
          markers: markers,
          boolMarker: true ,
          polyLineCoor : polyLine,
          names : names
      });
  }

  liftHomeState(response){
      this.setState({
          JSONString: response,
          returnFile: response.body,
          origUnit : response.body.options.earthRadius
      } , () => {
          this.refs.child.reRenderNewMap();
      });
  }

  updatePlacesArray(arr) {
      let newJSON = this.state.JSONString;
      newJSON.body.places = arr;
      this.setState({
        //JSONString: this.state.JSONString
        JSONString: newJSON,
      } , () => {
          this.refs.child.reRenderNewMap();
      });
  }


}
