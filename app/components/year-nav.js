import Ember from 'ember';
const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['nav--year', 'btn', 'btn-default', 'btn-lg'],
  classNameBindings: ['active:btn-primary'],
  active: computed('year', 'currentYear', function (){
    return get(this, 'year') == get(this, 'currentYear');
  }),
  mouseEnter() {
    this.sendAction('updateYear', get(this, 'year'));
  }
});
