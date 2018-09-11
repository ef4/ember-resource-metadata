import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  _resourceMetadata: service('resource-metadata'),
  serialize(snapshot, options) {
    let json = this._super(snapshot, options);
    let service = this.get('_resourceMetadata');
    let meta = service.peek(snapshot);
    if (meta) {
      json.data.meta = assign({}, json.data.meta, meta);
    }
    return json;
  }
});
