import Ember from 'ember';
import _ from 'npm:lodash';
import d3 from 'npm:d3';

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
      origins: $.getJSON(ORGIN_DATA),
      destinations: $.getJSON(DESTINATION_DATA),
    };
    return RSVP.hash(request).then((model) => {
      let { data, origins, destinations } = model;

      let newData= _.map(data, function(datum) {
        let origin = get(datum, 'origin');
        let dest_state = get(datum, 'dest_state');
        let originCoords =  get(origins, origin) || origins[origin] //Dem. Rep. Congo
        let destinationCoords = get(destinations, dest_state);
        set(datum, 'originCoords', originCoords);
        set(datum, 'destinationCoords', destinationCoords);
        return datum;
      });

      set(model, 'data', newData)

      return model;
    });
  },
});

