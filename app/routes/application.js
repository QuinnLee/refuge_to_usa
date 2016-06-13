import Ember from 'ember';
import _ from 'npm:lodash';

const { get, set, RSVP, $ } = Ember;

const DATA_URL = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/data-with-coord.json';
const MAP_URL = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/world-topo.json';
const ORGIN_DATA = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/origins.json';
const DESTINATION_DATA = 'https://raw.githubusercontent.com/QuinnLee/refuge_to_usa/master/data/destinations.json';

export default Ember.Route.extend({
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

    model.data  = _.chain(data)
      .filter('arrivals')
      .groupBy('year')
      .reduce((memo, values, key) => {
        let groupBy = _.groupBy(values, 'origin');
        let data = _.reduce(groupBy, (memo, values) => {
          let max = _.maxBy(values, 'arrivals');
          let arrivals = _.sumBy(values, 'arrivals');
          let first = _.first(values);
          let year = first.year;
          let origin = first.origin
          let destination = max.dest_state;
          let originCoordinates = get(originLocations, origin) || originLocations[origin];
          let destinationCoordinates = get(destinationLocations, destination);
          if(!originCoordinates) {debugger}
          if(!destinationCoordinates) {debugger}
          return memo.concat({ origin, year, values, arrivals, originCoordinates, destinationCoordinates });
        }, []);

        memo[key] = data;
        return memo;
      }, {})
      .value()
  }
});
