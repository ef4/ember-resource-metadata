import Ember from 'ember';

export default Ember.Helper.extend({
  resourceMetadata: Ember.inject.service(),
  compute([thing]) {
    return this.get('resourceMetadata').read(thing);
  }
});
