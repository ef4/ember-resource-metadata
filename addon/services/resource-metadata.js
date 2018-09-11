import EmberObject, { get, setProperties } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import {
  extractIdentityKey,
  lookupIdentityKey,
  WeakMap
} from '../private-api';

export default Service.extend({
  store: service(),

  init() {
    this._super();
    this.metastore = new WeakMap();
  },

  _identityFor(thing) {
    let identity = extractIdentityKey(thing);
    if (!identity) {
      let type = get(thing, 'type');
      let id = get(thing, 'id');
      identity = lookupIdentityKey(this.get('store'), type, id);
    }
    return identity;
  },

  write(thing, metadata) {
    let identity = this._identityFor(thing);
    let existing = this.metastore.get(identity);
    if (existing) {
      setProperties(existing, metadata);
    } else {
      this.metastore.set(identity, EmberObject.create(metadata));
    }
  },

  read(thing) {
    let identity = this._identityFor(thing);
    let meta = this.metastore.get(identity);
    if (!meta) {
      meta = EmberObject.create();
      this.metastore.set(identity, meta);
    }
    return meta;
  },


  peek(thing) {
    let identity = this._identityFor(thing);
    return this.metastore.get(identity);
  }

});
