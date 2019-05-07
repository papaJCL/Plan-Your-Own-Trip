import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Container, Input} from 'reactstrap';
import Home from './Home';
import Options from './Options/Options';
import About from './About/About';
import Calculator from './Calculator/Calculator';
import Settings from './Settings/Settings';
import SQL from './SQL'
import {getOriginalServerPort, sendServerRequest, sendServerRequestWithBody} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';
/*import {latitude} from './../../../../node_modules/magellan-coords/magellan';*/

/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
    constructor(props) {
        super(props);

        this.updatePlanOption = this.updatePlanOption.bind(this);
        this.updateClientSetting = this.updateClientSetting.bind(this);
        this.createApplicationPage = this.createApplicationPage.bind(this);
        this.createErrorBanner = this.createErrorBanner.bind(this);
        this.createErrorBannerState = this.createErrorBannerState.bind(this);
        this.updateIfGoodCalculator = this.updateIfGoodCalculator.bind(this);
        this.processConfigResponse = this.processConfigResponse.bind(this);
        this.setValue = this.setValue.bind(this);
        this.clearMapState = this.clearMapState.bind(this);
        this.reRenderNewMapState = this.reRenderNewMapState.bind(this);
        this.liftHomeState = this.liftHomeState.bind(this);
        this.updatePlacesArray = this.updatePlacesArray.bind(this);
        this.updateOldUnit = this.updateOldUnit.bind(this);
        this.renderFilterID = this.renderFilterID.bind(this);
        this.renderFilterName = this.renderFilterName.bind(this);
        this.renderFilterLatitude = this.renderFilterLatitude.bind(this);
        this.renderFilterLongitude = this.renderFilterLongitude.bind(this);
        this.renderFilterDistance = this.renderFilterDistance.bind(this);
        this.updateSQLState = this.updateSQLState.bind(this);
        this.updateItinerarySQL = this.updateItinerarySQL.bind(this);
        this.boolSQLFunc = this.boolSQLFunc.bind(this);
        this.setShowMarkerState = this.setShowMarkerState.bind(this);
        this.checkServerResponse = this.checkServerResponse.bind(this);
        this.addLocation = this.addLocation.bind(this);
        this.clearSQLState = this.clearSQLState.bind(this);
        this.updateLatLongState = this.updateLatLongState.bind(this);

        this.state = {
            serverConfig: null,
            planOptions: {
                units: {'miles': 3959, 'kilometers': 6371, 'nautical miles': 3440},
                activeUnit: 'miles'
            },
            clientSettings: {
                serverPort: getOriginalServerPort()
            },
            origin: {latitude: '', longitude: ''},
            destination: {latitude: '', longitude: ''},
            distance: 0,
            errorMessage: null,
            JSONString: {
                "body": {
                    "requestType": "itinerary",
                    "requestVersion": 2,
                    "options": {"title": "defaultJSON", "earthRadius": "3959"},
                    "places": [],
                    "distances": []
                }
            },
            returnFile: [],
            latitude: [],
            longitude: [],
            markers: [[]],
            boolMarker: false,
            polyLineCoor: [[]],
            names: [],
            oldUnits: '',
            origUnit: '',
            filterID: false,
            filterName: false,
            filterLat: true,
            filterLong: true,
            filterDist: false,
            SQLJson: [],
            SQLItineraryInfo: [],
            boolSQL: true,
            showMarkers: [false],
            geoBool: false

        };
        this.updateServerConfig();
    }

    render() {

        let pageToRender = this.state.serverConfig ? this.props.page : 'settings';

        return (
            <div className='application-width'>
                {this.state.errorMessage}{this.createApplicationPage(pageToRender)}
            </div>
        );
    }

    updateClientSetting(field, value) {
        if (field === 'serverPort')
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

    updateOldUnit() {
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

    createErrorBannerState(statusText, statusCode, message) {
        this.setState({
            errorMessage: <ErrorBanner statusText={statusText} statusCode={statusCode} message={message}/>
        });
    }

    checkServerResponse(code, response, type) {
        if (code === 400) {
            this.createErrorBannerState("Error", '400', "Invalid input parameters. Please try agin")
            return false;
        }
        var datafile
        if (type === "find") {
            datafile = require('../../Schemaresourcesclient/TIPFindResponseSchema.json')
        } else if (type === "itinerary") {
            datafile = require('../../Schemaresourcesclient/TIPItineraryResponseSchema.json')
        } else if (type === "config") {
            datafile = require('../../Schemaresourcesclient/TIPConfigResponseSchema.json')
        } else if (type === "distance") {
            datafile = require('../../Schemaresourcesclient/TIPDistanceResponseSchema.json')
        } else {
            this.createErrorBannerState("Error", '500', "Something went wrong, please try again");
            return false;
        }
        var Ajv = require('ajv');
        var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        var validate = ajv.compile(datafile);
        var valid = validate(response);
        if (!valid) {
            this.createErrorBannerState("Error", '500', "Something went wrong, please try again");
            return false;
        }

        return true;

    }


    createApplicationPage(pageToRender) {
        switch (pageToRender) {
            case 'calc':
                return <Calculator
                    options={this.state.planOptions}
                    distance={this.state.distance}
                    settings={this.state.clientSettings}
                    origin={this.state.origin}
                    destination={this.state.destination}
                    planOptions={this.state.planOptions}
                    createErrorBanner={this.createErrorBanner}
                    createErrorBannerState={this.createErrorBannerState}
                    updateLocationOnChange={this.updateLocationOnChange}
                    updateIfGoodCalculator={this.updateIfGoodCalculator}
                    checkServerResponse={this.checkServerResponse}
                    setValue={this.setValue}
                />;
            case 'options':
                return <Options
                    options={this.state.planOptions}
                    config={this.state.serverConfig}
                    oldUnits={this.state.oldUnits}
                    JSONString={this.state.JSONString}
                    updateOldUnit={this.updateOldUnit}
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

            case 'sql':
                return <SQL
                    markers={this.state.markers}
                    boolMarker={this.state.boolMarker}
                    polyLineCoor={this.state.polyLineCoor}
                    updateSQLState={this.updateSQLState}
                    clientSettings={this.state.clientSettings}
                    SQLMenu={this.state.SQLMenu}
                    SQLJson={this.state.SQLJson}
                    updateItinerarySQL={this.updateItinerarySQL}
                    SQLItineraryInfo={this.state.SQLItineraryInfo}
                    JSONString={this.state.JSONString}
                    planOptions={this.state.planOptions}
                    liftHomeState={this.liftHomeState}
                    boolSQLFunc={this.boolSQLFunc}
                    boolSQL={this.state.boolSQL}
                    reRenderNewMap={this.reRenderNewMap}
                    createErrorBanner={this.createErrorBanner}
                    createErrorBannerState={this.createErrorBannerState}
                    checkServerResponse={this.checkServerResponse}
                    addLocation={this.addLocation}
                    clearSQLState={this.clearSQLState}
                />;

            default:
                return <Home
                    clientSettings={this.state.clientSettings}
                    clearMapState={this.clearMapState}
                    reRenderNewMapState={this.reRenderNewMapState}
                    markers={this.state.markers}
                    JSONString={this.state.JSONString}
                    returnFile={this.state.returnFile}
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    boolMarker={this.state.boolMarker}
                    polyLineCoor={this.state.polyLineCoor}
                    names={this.state.names}
                    liftHomeState={this.liftHomeState}
                    setShowMarkerState={this.setShowMarkerState}
                    updatePlacesArray={this.updatePlacesArray}
                    createErrorBannerState={this.createErrorBannerState}
                    deleteError={this.deleteError}
                    planOptions={this.state.planOptions}
                    oldUnits={this.state.oldUnits}
                    origUnit={this.state.origUnit}
                    filterID={this.state.filterID}
                    filterName={this.state.filterName}
                    filterLat={this.state.filterLat}
                    filterLong={this.state.filterLong}
                    filterDist={this.state.filterDist}
                    renderFilterID={this.renderFilterID}
                    renderFilterName={this.renderFilterName}
                    renderFilterLatitude={this.renderFilterLatitude}
                    renderFilterLongitude={this.renderFilterLongitude}
                    renderFilterDistance={this.renderFilterDistance}
                    SQLJson={this.state.SQLJson}
                    updateSQLState={this.updateSQLState}
                    SQLItineraryInfo={this.state.SQLItineraryInfo}
                    updateItinerarySQL={this.updateItinerarySQL}
                    boolSQL={this.state.boolSQL}
                    boolSQLFunc={this.boolSQLFunc}
                    showMarkers={this.state.showMarkers}
                    checkServerResponse={this.checkServerResponse}
                    addLocation={this.addLocation}
                    updateLatLongState={this.updateLatLongState}
                    geoBool = {this.state.geoBool}
                    ref="child"
                />;
        }
    }

    renderFilterID() {
        if (this.state.filterID == true) this.setState({filterID: false})
        else {
            this.setState({filterID: true})
        }
    }

    renderFilterName() {
        if (this.state.filterName == true) this.setState({filterName: false})
        else {
            this.setState({filterName: true})
        }
    }

    renderFilterLatitude() {
        if (this.state.filterLat == true) this.setState({filterLat: false})
        else {
            this.setState({filterLat: true})
        }
    }

    renderFilterLongitude() {
        if (this.state.filterLong == true) this.setState({filterLong: false})
        else {
            this.setState({filterLong: true})
        }
    }

    renderFilterDistance() {
        if (this.state.filterDist == true) this.setState({filterDist: false})
        else {
            this.setState({filterDist: true})
        }
    }

    processConfigResponse(config) {
        if (config.statusCode >= 200 && config.statusCode <= 299) {
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

    updateIfGoodCalculator(response) {
        this.setState({
            distance: response.body.distance,
            errorMessage: null
        });
    }

    setValue(stateVar, location) {
        this.setState({[stateVar]: location});
    }

    clearMapState() {
        this.setState({
            JSONString: {
                "body": {
                    "requestType": "itinerary",
                    "requestVersion": 2,
                    "options": {"title": "defaultJSON", "earthRadius": "3959"},
                    "places": [],
                    "distances": []
                }
            },
            returnFile: [],
            latitude: [],
            longitude: [],
            markers: [[]],
            boolMarker: false,
            names: [],
            origUnit: 0,
            errorMessage: null,
            SQLJson: [],
            SQLItineraryInfo: [],
            boolSQL: true,
            showMarkers: [false]
        });
    }

    clearSQLState() {
        this.setState({
            SQLJson: [],
            SQLItineraryInfo: [],
            boolSQL: true,
        });
    }

    reRenderNewMapState(latitude, longitude, names, polyLine, markers) {
        this.setState({
            errorMessage: null,
            latitude: latitude,
            longitude: longitude,
            markers: markers,
            boolMarker: true,
            polyLineCoor: polyLine,
            names: names,

        });
    }

    liftHomeState(response) {
        console.log("liftHomeState ", response)
        let markers = this.state.showMarkers;
        if (this.state.showMarkers.length === 1)
            for (let i = 0; i < response.body.places.length; i++) markers.push(false);

        this.setState({
            JSONString: response,
            returnFile: response.body,
            origUnit: Math.round(response.body.options.earthRadius),
            showMarkers: markers,
           // latitude:[lat],
           // longitude:[long]
            geoBool: true
        }, () => {
            this.reRenderNewMap();
        });
    }

    updatePlacesArray(arr) {
        let newJSON = this.state.JSONString;
        newJSON.body.places = arr
        var request = {
            "requestType": "itinerary",
            "requestVersion": 3,
            "options": {"earthRadius": "" + Math.round(parseFloat(this.state.JSONString.body.options.earthRadius))},
            "places": arr,
            "distances": [],
        };

        sendServerRequestWithBody('itinerary', request, this.state.clientSettings.serverPort)
            .then((response) => {
                console.log(response.statusCode)
                var valid = this.checkServerResponse(response.statusCode, response.body, 'itinerary')
                if (valid) {
                    this.liftHomeState(response);
                }
            });
        this.setState({
            //JSONString: this.state.JSONString
            JSONString: newJSON,
            errorMessage: null
        }, () => {
            this.reRenderNewMap();
        });
    }

    updateSQLState(newJSON) {
        this.setState({
            errorMessage: null,
            SQLJson: newJSON
        });
    }

    updateItinerarySQL(sql) {
        this.addLocation(sql.name, sql.latitude, sql.longitude);
    }

    boolSQLFunc() {
        this.setState({
            boolSQL: false
        })
    }

    reRenderNewMap() {

        let places = this.state.JSONString.body.places
        const mappingFunction = p => p.latitude;
        const mappingFunction1 = p => p.longitude;
        const mappingFunction2 = p => p.name;

        const latitude = places.map(mappingFunction)
        const longitude = places.map(mappingFunction1)
        const names = places.map(mappingFunction2)

        var markers = [[]]
        var polyLine = [[]]


        for (var i = 0; i < latitude.length; i++) {
            var hold = []
            hold.push(latitude[i])
            hold.push(longitude[i])
            markers.push(hold)
        }

        markers.shift()
        polyLine = markers.slice(0)
        polyLine.push(markers[0])
        this.reRenderNewMapState(latitude, longitude, names, polyLine, markers)
    }

    checkMarkers() {
        let countTrue = 0;
        let countFalse = 0;
        let newarr = this.state.showMarkers
        for (let i = 1; i < this.state.showMarkers.length; i++) {
            (newarr[i]) ? countTrue++ : countFalse++;
        }
        if (countTrue === this.state.showMarkers.length - 1) newarr[0] = true;
        else if (countFalse === this.state.showMarkers.length - 1) newarr[0] = false;
        return newarr;
    }

    setShowMarkerState(idx) {
        let newarr = this.checkMarkers();
        let bool = false;
        (this.state.showMarkers[idx]) ? bool = false : bool = true;
        newarr[idx] = bool;
        if (idx === 0) {
            for (let i = 1; i < this.state.showMarkers.length; i++) {
                (newarr[0]) ? newarr[i] = true : newarr[i] = false;
            }
        }
        this.setState({
            showMarkers: newarr
        })
    }

    addLocation(name, lat, long) {
        console.log(name, lat, long)

        var magellan = require('./../../../../node_modules/magellan-coords/magellan');
        if (magellan(lat).latitude() === null || magellan(long).longitude() === null) {
            this.createErrorBannerState('Error', '500', 'Invalid Latitude or Longitude Entered Into Add a New Location');
            return;
        }
        if ((lat.includes('N') || lat.includes('W') || lat.includes('E') || lat.includes('S') || lat.includes('°'))) {
            lat = magellan(lat).latitude().toDD();
        }
        if ((long.includes('N') || long.includes('W') || long.includes('E') || long.includes('S') || long.includes('°'))) {
            long = magellan(long).longitude().toDD();
        }

        let newplaces = this.state.JSONString.body.places;
        let newloc = {
            "name": name,
            "latitude": lat,
            "longitude": long,
            "id": "" + this.state.JSONString.body.places.length
        };
        newplaces.push(newloc);
        (this.state.showMarkers[0]) ? this.state.showMarkers.push(true) : this.state.showMarkers.push(false);
        this.updatePlacesArray(newplaces);

    }


    updateLatLongState(lat, long) {
        console.log("update state")
        this.setState ({
            latitude: [lat],
            longitude: [long]
        })
    }
}
