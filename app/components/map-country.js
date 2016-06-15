import topojson from 'npm:topojson';
const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: 'path',
  attributeBindings: ['d'],
  classNames: ['boundary'],
  d: computed('feature','path', function() {
    let path = get(this, 'path');
    let feature = get(this, 'feature');
    return path(feature);
  })
});
