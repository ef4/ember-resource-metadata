import JSONAPISerializer from 'ember-data/serializers/json-api';
import Ember from 'ember';

export default JSONAPISerializer.extend({
  _resourceMetadata: Ember.inject.service('resource-metadata'),
  normalize(type, hash) {
    let document = this._super(type, hash);
    if (hash.meta) {
      let service = this.get('_resourceMetadata');
      service.write({ type: document.data.type, id: document.data.id }, hash.meta);
    }
    return document;
  },
  serialize(snapshot, options) {
    let json = this._super(snapshot, options);
    let service = this.get('_resourceMetadata');
    let meta = service.peek(snapshot);
    if (meta) {
      json.data.meta = Object.assign({}, json.data.meta, meta);
    }
    return json;
  }
});
