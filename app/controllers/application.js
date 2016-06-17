import Ember from 'ember';
import d3 from 'npm:d3';
import _ from 'npm:lodash';

const { computed, get, set } = Ember;
const { reduce, groupBy } = _;

export default Ember.Controller.extend({
  dotRange: [5,20],
  queryParams: ['year'],
  year: 2015,
  years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
  location: null,
  currentYear: computed.alias('year'),
  origins: computed.alias('model.origins'),
  destinations: computed.alias('model.destinations'),
  data: computed.alias('model.data'),
  locations: computed('origins', 'destinations', function() {
    let origins = get(this, 'origins');
    let destinations = get(this, 'destinations');
    return Object.assign(origins, destinations);

  }),
  filteredData: computed('data', 'year', function() {
    let location = get(this, 'location');
    let data = get(this, 'data');
    let year = get(this, 'year');

    let filteredData = _.chain(data)
    if(year) {
      return filteredData.filter({ year: year }).value()
    }
    return data;
  }),
  groupByOrigin: computed('filteredData', function() {
    let filteredData = get(this, 'filteredData');
    return groupBy(filteredData, 'origin');
  }),
  groupByDestination: computed('filteredData', function() {
    let filteredData = get(this, 'filteredData');
    return groupBy(filteredData, 'dest_state');
  }),
  visualizationData: computed('groupByDestination', 'groupByOrigin', 'locations',  function() {
    let locations = get(this, 'locations');
    let groupByOrigin = get(this, 'groupByOrigin');
    let groupByDestination = get(this, 'groupByDestination');

    return reduce(locations, (memo, coords, country) => {
      let originValues =  get(groupByOrigin, country) || groupByOrigin[country];
      let destinationValues =  get(groupByDestination, country) || groupByDestination[country];
      let values = originValues || destinationValues;

      let type;

      let arrivals =  _.sumBy(values, 'arrivals');

      if(originValues) {
        type = 'origin';
      } else {
        type = 'destination';
      }
      return memo.concat({location: country, values, arrivals, coords, type});

    }, [])
  }),
  arrivalExtent: computed('visualizationData', function() {
    let originsData = get(this, 'visualizationData');
    return d3.extent(originsData, (d) =>  d.arrivals );
  }),
  radiusScale: computed('arrivalExtent', function() {
    return d3.scale.linear()
      .domain(get(this, 'arrivalExtent'))
      .range(get(this, 'dotRange'));
  }),
  originColorScale: computed('arrivalExtent', function() {
    return d3.scale.linear()
      .domain(get(this, 'arrivalExtent'))
      .clamp(true)
      .range(['#00b200', '#003300']);
  }),
  destinationColorScale: computed('arrivalExtent', function() {
    return d3.scale.linear()
      .domain(get(this, 'arrivalExtent'))
      .clamp(true)
      .range(['#FFCCCB', 'red']);
  }),
  arcs: computed('location', 'visualizationData', function() {
    let location = get(this, 'location');
    let data = get(this, 'visualizationData');

    if(!location){ return []; }
    let value = data.filter((d) => get(d, 'location') === location)[0]
    return get(value, 'values');
  }),
  actions: {
    updateYear: function(year) {
      this.transitionToRoute('index', { queryParams: { year }});
    }
  }
});
