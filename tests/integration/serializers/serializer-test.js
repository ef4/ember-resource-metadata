import { moduleForComponent, test, skip } from 'ember-qunit';
import DS from 'ember-data';
import RSVP from 'rsvp';
import Serializer from 'ember-resource-metadata/serializer';

let answers = [];

moduleForComponent('serializer', 'Integration | Serializer | serializer', {
  integration: true,
  beforeEach() {
    this.register('model:example', DS.Model.extend({
      title: DS.attr('string')
    }));
    this.register('adapter:example', DS.JSONAPIAdapter.extend({
      ajax(/* url, type, options */) {
        return RSVP.resolve(answers.shift());
      }
    }));
    this.register('serializer:example', Serializer);
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

skip('it updates meta when a record is created', function(assert) {
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
