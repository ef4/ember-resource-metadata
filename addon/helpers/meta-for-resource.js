import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';

export default Helper.extend({
  resourceMetadata: service(),
  compute([thing]) {
    return this.get('resourceMetadata').read(thing);
  }
});
