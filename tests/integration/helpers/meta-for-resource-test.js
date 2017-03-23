import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';
import Ember from 'ember';

moduleForComponent('meta-for-resource', 'Integration | Helper | meta for resource', {
  integration: true,
  beforeEach() {
    this.register('model:example', DS.Model.extend({
      title: DS.attr('string')
    }));
    this.inject.service('resource-metadata', { as: 'metadata' });
    this.inject.service('store');
    this.set('model', this.get('store').createRecord('example', { title: 'hello' }));
  }
});

test('it works when meta already exists', function(assert) {
  this.get('metadata').write(this.get('model'), { someMetaKey: 42 });
  this.render(hbs`<div class="output">{{get (meta-for-resource model) 'someMetaKey'}}</div>`);
  assert.equal(this.$('.output').text(), '42');
});

test('it works when meta is set later', function(assert) {
  this.render(hbs`<div class="output">{{get (meta-for-resource model) 'someMetaKey'}}</div>`);

  assert.equal(this.$('.output').text(), '');

  Ember.run(() => {
    this.get('metadata').write(this.get('model'), { someMetaKey: 42 });
  });

  assert.equal(this.$('.output').text(), '42');

});
