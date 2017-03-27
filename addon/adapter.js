import DS from 'ember-data';
import Ember from 'ember';

export default DS.JSONAPIAdapter.extend({
  _resourceMetadata: Ember.inject.service('resource-metadata'),

  _correlateMetadata(record, fn) {
    return fn().then(response => {
      if (response.data.meta) {
        let service = this.get('_resourceMetadata');
        if (record) {
          service.write(record, response.data.meta);
        } else {
          service.write({ id: response.data.id, type: response.data.type }, response.data.meta);
        }
      }
      return response;
    });

  },

  createRecord(store, type, snapshot) {
    return this._correlateMetadata(snapshot.record, () => {
      return this._super(store, type, snapshot);
    });
  },

  updateRecord(store, type, snapshot) {
    return this._correlateMetadata(snapshot.record, () => {
      return this._super(store, type, snapshot);
    });
  },

  findRecord(store, type, id, snapshot) {
    return this._correlateMetadata(snapshot.record, () => {
      return this._super(store, type, id, snapshot);
    });
  },

  queryRecord(store, type, query) {
    return this._correlateMetadata(null, () => {
      return this._super(store, type, query);
    });
  }
})
