import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';

module('Integration | Helper | meta for resource', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('model:example', DS.Model.extend({
      title: DS.attr('string')
    }));
    this.metadata = this.owner.lookup('service:resource-metadata');
    this.store = this.owner.lookup('service:store');
    this.set('model', this.get('store').createRecord('example', { title: 'hello' }));
  });

  test('it works when meta already exists', async function(assert) {
    this.get('metadata').write(this.get('model'), { someMetaKey: 42 });
    await render(hbs`<div class="output">{{get (meta-for-resource model) 'someMetaKey'}}</div>`);
    assert.equal(find('.output').textContent.trim(), '42');
  });

  test('it works when meta is set later', async function(assert) {
    await render(hbs`<div class="output">{{get (meta-for-resource model) 'someMetaKey'}}</div>`);

    assert.equal(find('.output').textContent.trim(), '');

    run(() => {
      this.get('metadata').write(this.get('model'), { someMetaKey: 42 });
    });

    assert.equal(find('.output').textContent.trim(), '42');
  });
});
