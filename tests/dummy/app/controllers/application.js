import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    mangle() {
      let model = this.get('model');
      let title = model.get('title');
      model.set('title', title + '!');
      model.save();
    }
  }
});
