import { moduleForComponent, test } from 'ember-qunit';
import DS from 'ember-data';
import RSVP from 'rsvp';
import Adapter from 'ember-resource-metadata/adapter';

let answers = [];
let requests = [];

moduleForComponent('adapter', 'Integration | Adapter | adapter', {
  integration: true,
  beforeEach() {
    this.register('model:example', DS.Model.extend({
      title: DS.attr('string')
    }));
    this.register('adapter:example', Adapter.extend({
      ajax(url, type, options) {
        requests.push({ url, type, options });
        return RSVP.resolve(answers.shift());
      }
    }));
    this.inject.service('resource-metadata', { as: 'metadata' });
    this.inject.service('store');
  }
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
