import Ember from 'ember';
import topojson from 'npm:topojson';
import d3 from 'npm:d3';

const { computed, get, set } = Ember;

export default Ember.Component.extend({
  height: 550,
  width: 800,
  topMargin: 50,
  bottomMargin: 50,
  leftMargin: 50,
  rightMargin: 50,
  tagName: 'svg',
  attributeBindings: ['height', 'width'],
  mapData: computed('data', 'voronoi', function() {
    let data = get(this, 'data');
    let projection = get(this, 'projection');
    data = data.map((datum) => {
      let coords = get(datum, 'coords');
      set(datum, 'projectionCoords',projection([coords.long, coords.lat]));
      return datum;
    });

    get(this, 'voronoi')(data)
      .forEach(function(d) { set(d, 'point.cell', d); });

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
      .scale(120)
      .translate([width / 2, height / 2])
      .center([0, 55])
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
  legendCircles: computed('radiusScale', function() {
    let radiusScale = get(this, 'radiusScale');
    return radiusScale.ticks(4).map((d) => {
      return { r: radiusScale(d), cx: Math.pow(radiusScale(d),2), value: d };
    });
  }),
  mouseLeave() {
    set(this, 'location', null);
    set(this, 'type', null);
  }
});
