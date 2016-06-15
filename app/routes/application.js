import Ember from 'ember';
import _ from 'npm:lodash';
import d3 from 'npm:d3';

const { get, set, RSVP, $ } = Ember;

const DATA_URL = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/data-with-coord.json';
const MAP_URL = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/world-topo.json';
const ORGIN_DATA = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/origins.json';
const DESTINATION_DATA = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/destinations.json';


export default Ember.Route.extend({
  queryParams: {
    year: {
      refreshModel: false
    }
  },
  model() {
    const request = {
      data: $.getJSON(DATA_URL),
      map: $.getJSON(MAP_URL),
      origin: $.getJSON(ORGIN_DATA),
      destination: $.getJSON(DESTINATION_DATA),
    };

    return RSVP.hash(request);
  },
  afterModel(model) {
    let data = get(model, 'data');

    const originLocations = get(model, 'origin')
    const destinationLocations = get(model, 'destination');

    let filteredData = _.chain(data)
      .filter('arrivals')
      .filter('year', this.get('year'))
      .value()

    let originData = _.chain(filteredData)
      .groupBy('origin')
      .reduce((memo, values) => {
         let arrivals = _.sumBy(values, 'arrivals');
         let first = _.first(values);
         let year = first.year;
         let origin = first.origin
         if(origin === 'Norway') {debugger}
         let originCoordinates = get(originLocations, origin) || originLocations[origin]; // cause of `Dem. Rep. Congo
         return memo.concat({ location: origin, year, values, arrivals, coords: originCoordinates, type: 'origin' });
       }, [])
       .value();

    let destinationData = _.chain(filteredData)
      .groupBy('dest_state')
      .reduce((memo, values) => {
         let arrivals = _.sumBy(values, 'arrivals');
         let first = _.first(values);
         let year = first.year;
         let destination = first.dest_state
         let destinationCoordinates = get(destinationLocations, destination);
         return memo.concat({ location:destination , year, values, arrivals, coords: destinationCoordinates, type: 'destination' });
       }, [])
       .value();

    model.data = destinationData.concat(originData);

    model.destinationData = destinationData;
    model.originData = originData;

    return model;
  }
});
