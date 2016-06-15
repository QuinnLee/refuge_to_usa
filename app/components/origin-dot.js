import Ember from 'ember';
import d3 from 'npm:d3';
const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: 'g',
  attributeBindings: ['transform'],
  r: computed('datum', function(){
    let arrivals = get(this, 'datum.arrivals');
    return get(this, 'originScale')(arrivals);
  }),
  originLongLat: computed('datum.originCoordinates.long','datum.originCoordinates.lat', function() {
    let coords = get(this, 'datum.originCoordinates');
    return [ coords.long, coords.lat]
  }),
  destinationLongLat: computed('datum.destinationCoordinates.long','datum.destinationCoordinates.lat', function() {
    let coords = get(this, 'datum.destinationCoordinates');
    return [ coords.long, coords.lat]
  }),
  transform: computed('originLongLat', 'destinationLongLat', 'type', function() {
    let projection = get(this, 'projection');
    let coords = get(this, `${get(this, 'type')}LongLat`);
    return `translate(${projection(coords)})`
  })
});
