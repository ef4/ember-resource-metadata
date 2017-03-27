import Ember from 'ember';

export default Ember.Mixin.create({
  _resourceMetadata: Ember.inject.service('resource-metadata'),
  serialize(snapshot, options) {
    let json = this._super(snapshot, options);
    let service = this.get('_resourceMetadata');
    let meta = service.peek(snapshot);
    if (meta) {
      json.data.meta = Ember.assign({}, json.data.meta, meta);
    }
    return json;
  }
});
