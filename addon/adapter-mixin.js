import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  _resourceMetadata: service('resource-metadata'),

  _correlateMetadata(record, fn) {
    return fn().then(response => {
      if (Array.isArray(response.data)) {
        response.data.forEach(hash => this._correlateResource(record, hash));
      } else {
        this._correlateResource(record, response.data);
      }
      return response;
    });
  },

  _correlateResource(record, hash) {
    if (hash.meta) {
      let service = this.get('_resourceMetadata');
      if (record) {
        service.write(record, hash.meta);
      } else {
        service.write({ id: hash.id, type: hash.type }, hash.meta);
      }
    }
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
    if (query.disableResourceMetadata) {
      query = Object.assign({}, query);
      delete query.disableResourceMetadata;
      return this._super(store, type, query);
    }
    return this._correlateMetadata(null, () => {
      return this._super(store, type, query);
    });
  },

  query(store, type, query) {
    return this._correlateMetadata(null, () => {
      return this._super(store, type, query);
    });
  }

})
