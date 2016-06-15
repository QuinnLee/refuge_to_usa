import Ember from 'ember';
import d3 from 'npm:d3';
const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: 'g',
  r: computed('datum', function(){
    let arrivals = get(this, 'datum.arrivals');
    return get(this, 'radiusScale')(arrivals);
  }),
  voronoiPath: computed('datum.cell', function() {
    let cell = get(this, 'datum.cell');
    if(cell) {
      return cell.length ? "M" + cell.join("L") + "Z" : null;
    } else {
      return null;
    }
  }),
  fill: computed('datum', function() {
    let colorValue = get(this, 'datum.arrivals');
    let type = get(this, 'datum.type');
    return get(this, `${type}ColorScale`)(colorValue);
  }),
  transform: computed('datum.projectionCoords', function() {
    let coords = get(this, 'datum.projectionCoords');
    return `translate(${coords})`;
  }),
  mouseEnter() {
    console.log(this.get('datum.location'));
  }
});
