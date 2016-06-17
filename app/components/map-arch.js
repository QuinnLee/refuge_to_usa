import Ember from 'ember';
const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: 'path',
  attributeBindings: ['d'],
  classNames: ['travel-path'],
  destLongLat: computed('datum.destinationCoords.lat','datum.destinationCoords.long', function() {
    let coords = get(this, 'datum.destinationCoords');
    return [ coords.long, coords.lat]

  }),
  originLongLat: computed('datum.originCoords.long','datum.originCoords.lat', function() {
    let coords = get(this, 'datum.originCoords');
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
