import Ember from 'ember';
import topojson from 'npm:topojson';
import d3 from 'npm:d3';

const { computed, get } = Ember;

export default Ember.Component.extend({
  height: 500,
  width: 1100,
  topMargin: 50,
  bottomMargin: 50,
  leftMargin: 50,
  rightMargin: 50,
  tagName: 'svg',
  attributeBindings: ['height', 'width'],
  translate: computed('topMargin', 'leftMargin', function() {
    return `translate(${this.leftMargin}, ${this.topMargin})`;
  }),
  projection: computed('height', 'width', function() {
    let height = get(this, 'height') - this.topMargin - this.bottomMargin;
    let width = get(this, 'width') - this.leftMargin - this.rightMargin;
    return d3.geo.mercator()
      .scale(130)
      .translate([width / 2, height / 2])
      .center([0, 40])
      .precision(0.1);
  }),
  path: computed('projection', function() {
    return d3.geo.path()
      .projection(get(this, 'projection'));
  }),
  mapProjection: computed('path', 'map', function() {
    let path = get(this, 'path');
    let map = get(this, 'map');
    let features = topojson.feature(map, map.objects.countries).features;
    return features.map(path)
  }),
});
