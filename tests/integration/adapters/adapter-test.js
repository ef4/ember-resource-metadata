import JSONAPIAdapter from '@ember-data/adapter/json-api';
import JSONAPISerializer from '@ember-data/serializer/json-api';
import Model, { attr, hasMany } from '@ember-data/model';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import '@ember/test-helpers';
import RSVP from 'rsvp';
import AdapterMixin from 'ember-resource-metadata/adapter-mixin';

let answers;
let requests;

module('Integration | Adapter | adapter', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    answers = [];
    requests = [];
    this.owner.register('serializer:application', JSONAPISerializer);
    this.owner.register('model:example', Model.extend({
      title: attr('string'),
      references: hasMany('references', { async: false })
    }));
    this.owner.register('model:reference', Model.extend({
      source: attr('string')
    }));
    this.owner.register('adapter:example', JSONAPIAdapter.extend(AdapterMixin, {
      ajax(url, type, options) {
        requests.push({ url, type, options });
        return RSVP.resolve(answers.shift());
      }
    }));
    this.metadata = this.owner.lookup('service:resource-metadata');
    this.store = this.owner.lookup('service:store');
  });

  test('it sets meta when loading a record for the first time', function(assert) {
    answers.push({
      data: {
        type: 'examples',
        id: 1,
        meta: {
          something: 42
        }
      }
    });
    return RSVP.resolve().then(() => {
      return this.get('store').findRecord('example', 1);
    }).then(record => {
      assert.equal(this.get('metadata').read(record).get('something'), 42);
    });
  });

  test('it passes options through to super findRecord', function(assert) {
    answers.push({
      data: {
        type: 'examples',
        id: 1,
        meta: {
          something: 42
        }
      }
    });
    return RSVP.resolve().then(() => {
      return this.get('store').findRecord('example', 1, { include: 'other' });
    }).then(() => {
      assert.deepEqual(requests[0].options, { data: { include: 'other'} });
    });
  });


  test('it sets meta when loading a record for the first time via queryRecord', function(assert) {
    answers.push({
      data: {
        type: 'examples',
        id: 1,
        meta: {
          something: 42
        }
      }
    });
    return RSVP.resolve().then(() => {
      return this.get('store').queryRecord('example', {});
    }).then(record => {
      assert.equal(this.get('metadata').read(record).get('something'), 42);
    });
  });

  test('it sets meta when loading a record for the first time via query', function(assert) {
    answers.push({
      data: [{
        type: 'examples',
        id: 1,
        meta: {
          something: 42
        }
      }]
    });
    return RSVP.resolve().then(() => {
      return this.get('store').query('example', {});
    }).then(records => {
      assert.equal(this.get('metadata').read(records.get('firstObject')).get('something'), 42);
    });
  });


  test('it updates meta when a record is updated', function(assert) {
    answers.push({
      data: {
        type: 'examples',
        id: 1,
        meta: {
          something: 42
        }
      }
    });
    answers.push({
      data: {
        type: 'examples',
        id: 1,
        meta: {
          something: 43
        }
      }
    });
    return RSVP.resolve().then(() => {
      return this.get('store').findRecord('example', 1);
    }).then(record => {
      return record.save();
    }).then(record => {
      assert.equal(this.get('metadata').read(record).get('something'), 43);
    });
  });

  test('it updates meta when a record is created', function(assert) {
    answers.push({
      data: {
        type: 'examples',
        id: 1,
        meta: {
          something: 43
        }
      }
    });
    return RSVP.resolve().then(() => {
      return this.get('store').createRecord('example');
    }).then(record => {
      return record.save();
    }).then(record => {
      assert.equal(this.get('metadata').read(record).get('something'), 43);
    });
  });

  test('it sets meta in included records', function(assert) {
    answers.push({
      data: {
        type: 'examples',
        id: 1,
        meta: {
          something: 42
        }
      },
      included: [
        {
          id: 1,
          type: 'references',
          meta: {
            something: 24
          }
        },
        {
          id: 2,
          type: 'references',
          meta: {
            something: 20
          }
        },
      ]
    });
    return RSVP.resolve().then(() => {
      return this.get('store').findRecord('example', 1);
    }).then(record => {
      assert.equal(this.get('metadata').read(record).get('something'), 42);
      assert.equal(this.get('metadata').read({ id: 1, type: 'reference' }).get('something'), 24);
      assert.equal(this.get('metadata').read({ id: 2, type: 'reference' }).get('something'), 20);
    });
  });
});
