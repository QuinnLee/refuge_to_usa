import Ember from 'ember';
import topojson from 'npm:topojson';
import d3 from 'npm:d3';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  height: 550,
  width: 1100,
  topMargin: 50,
  bottomMargin: 50,
  leftMargin: 50,
  rightMargin: 50,
  tagName: 'svg',
  attributeBindings: ['height', 'width'],
  dotRange: [1,12],
  mapData: computed('data', 'voronoi', function() {
    let data = get(this, 'data');
    let projection = get(this, 'projection');
    data = data.map((datum) => {
      let coords = get(datum, 'coords');
      set(datum, 'projectionCoords',projection([coords.long, coords.lat]));
      return datum;
    });
    get(this, 'voronoi')(data)
      .forEach(function(d) { set(d, 'point.cell', d); })
    return data;
  }),
  translate: computed('topMargin', 'leftMargin', function() {
    return `translate(${this.leftMargin}, ${this.topMargin})`;
  }),
  features: computed('map.objects.countries', 'map', function() {
    let map = get(this, 'map');
    return topojson.feature(map, map.objects.countries).features;
  }),
  projection: computed('height', 'width', function() {
    let height = get(this, 'height') - this.topMargin - this.bottomMargin;
    let width = get(this, 'width') - this.leftMargin - this.rightMargin;
    return d3.geo.mercator()
      .scale(153)
      .translate([width / 2, height / 2])
      .center([0, 30])
      .precision(0.1);
  }),
  path: computed('projection', function() {
    return d3.geo.path()
      .projection(get(this, 'projection'));
  }),
  voronoi: computed('height', 'width', function() {
    let height = get(this, 'height') -50;
    let width = get(this, 'width')-50;
    return d3.geom.voronoi()
      .x((d) => get(d, 'projectionCoords')[0])
      .y((d) => get(d, 'projectionCoords')[1])
      .clipExtent([[-50, -50], [width, height]]);
  }),
  mouseLeave() {
    set(this, 'location', null);
  }
});
