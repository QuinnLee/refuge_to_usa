import Ember from 'ember';

export function formatRefugee(params/*, hash*/) {
  let number = params[0];
  if(number === 1) { return 'refugee' }
  return 'refugees'
}

export default Ember.Helper.helper(formatRefugee);
