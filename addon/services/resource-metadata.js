import Ember from 'ember';
import {
  extractIdentityKey,
  lookupIdentityKey,
  WeakMap
} from '../private-api';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  init() {
    this._super();
    this.metastore = new WeakMap();
  },

  _identityFor(thing) {
    let identity = extractIdentityKey(thing);
    if (!identity) {
      let type = Ember.get(thing, 'type');
      let id = Ember.get(thing, 'id');
      identity = lookupIdentityKey(this.get('store'), type, id);
    }
    return identity;
  },

  write(thing, metadata) {
    let identity = this._identityFor(thing);
    let existing = this.metastore.get(identity);
    if (existing) {
      Ember.setProperties(existing, metadata);
    } else {
      this.metastore.set(identity, Ember.Object.create(metadata));
    }
  },

  read(thing) {
    let identity = this._identityFor(thing);
    let meta = this.metastore.get(identity);
    if (!meta) {
      meta = Ember.Object.create();
      this.metastore.set(identity, meta);
    }
    return meta;
  },


  peek(thing) {
    let identity = this._identityFor(thing);
    return this.metastore.get(identity);
  }

});
