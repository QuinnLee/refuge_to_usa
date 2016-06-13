import Ember from 'ember';
import d3 from 'npm:d3';

const { computed, get } = Ember;

export default Ember.Controller.extend({
  filteredData: computed('data', function() {
   console.log(get(this, 'model.data.2005'));
   return get(this, 'model.data.2005');

  })
});
