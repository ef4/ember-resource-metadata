import Ember from 'ember';

export default Ember.Helper.extend({
  _emberResourceMetadata: Ember.inject.service('ember-resource-metadata'),
  compute([thing]) {
    return this.get('_emberResourceMetadata').read(thing);
  }
});
