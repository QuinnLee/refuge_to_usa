import Ember from 'ember';
import d3 from 'npm:d3';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  year: 2015,
  dotRange: [5,20],
  arrivalExtent: computed('model.data', function() {
    let originsData = get(this, 'model.data');
    return d3.extent(originsData, (d) =>  d.arrivals );
  }),
  destinationColorExtent: computed('model.destinationData', function() {
    let originData = get(this, 'model.destinationData');
    return d3.extent(originData, (d) => d.arrivals);
  }),
  originColorExtent: computed('model.originData', function() {
    let originData = get(this, 'model.originData');
    return d3.extent(originData, (d) => d.arrivals);
  }),
  radiusScale: computed('arrivalExtent', function() {
    return d3.scale.linear()
      .domain(get(this, 'arrivalExtent'))
      .range(get(this, 'dotRange'));
  }),
  originColorScale: computed('originColorExtent', function() {
    return d3.scale.log()
      .domain(get(this, 'originColorExtent'))
      .clamp(true)
      .range(['white', '#006400']);
  }),
  destinationColorScale: computed('destinationColorExtent', function() {
    return d3.scale.log()
      .domain(get(this, 'destinationColorExtent'))
      .clamp(true)
      .range(['white', 'red']);
  })
});
