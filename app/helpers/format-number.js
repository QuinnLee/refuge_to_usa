import Ember from 'ember';
import numbro from 'npm:numbro';

export function formatNumber(params/*, hash*/) {
  return numbro(params[0]).format('0,0');
}

export default Ember.Helper.helper(formatNumber);
