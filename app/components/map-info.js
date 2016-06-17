import Ember from 'ember';
import _ from 'npm:lodash';
import numbro from 'npm:numbro';

const { computed, get } = Ember;
const { sumBy, last, first } = _;

export default Ember.Component.extend({
  tagName: 'aside',
  classNames: ['aside--element'],
  locationData: computed.sort('arcs', function(a,b) {
    if (get(a, 'arrivals') > get(b, 'arrivals')) {
      return 1;
    } else if (get(a, 'arrivals') < get(b, 'arrivals')) {
      return -1;
    }
    return 0;
  }),
  totalArrivals: computed('data', function() {
    let data = get(this, 'data');
    return numbro(sumBy(data, 'arrivals')/2).format('0,0');
  }),
  locationTotal: computed('locationData', function() {
    let locationData = get(this, 'locationData');
    return sumBy(locationData, 'arrivals')
  }),
  verbCopy: computed('type', function() {
    let type = get(this, 'type');
    if(type === 'origin'){
      return 'fled';
    } else if (type === 'destination') {
      return 'entered';
    }
  }),
  locationCount: computed('locationData', function() {
    return get(this, 'locationData').length;
  }),
  hasManyLocations: computed('locationCount', function() {
    return get(this, 'locationCount') > 1;
  }),
  hasOrigin: computed('type', function() {
    let type = get(this, 'type');
    return type === 'origin';
  }),
  maxLocationDatum: computed('locationData', function() {
    let locationData = get(this, 'locationData');
    return last(locationData);
  }),
  minLocationDatum: computed('locationData', function() {
    let locationData = get(this, 'locationData');
    return first(locationData);
  }),

});
