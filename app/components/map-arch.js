import Ember from 'ember';
const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: 'path',
  attributeBindings: ['d'],
  classNames: ['travel-path'],
  destLongLat: computed('datum.destinationCoordinates.lat','datum.destinationCoordinates.long', function() {
    let coords = get(this, 'datum.destinationCoordinates');
    return [ coords.long, coords.lat]
  }),
  originLongLat: computed('datum.originCoordinates.long','datum.originCoordinates.lat', function() {
    let coords = get(this, 'datum.originCoordinates');
    return [ coords.long, coords.lat]
  }),
  route: computed('originLongLat', 'destLongLat', function() {
    return {
      type: "LineString",
      coordinates: [
        get(this, 'destLongLat'),
        get(this, 'originLongLat')
      ]
    };
  }),
  d: computed('path', 'route', function() {
    return get(this, 'path')(get(this, 'route'));
  }),
});
