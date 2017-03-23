/*
  this module is intended to contain all uses of Ember and Ember Data
  private APIs that are needed to make this addon function
*/

import Ember from 'ember';
import normalizeModelName from "ember-data/-private/system/normalize-model-name";

export function lookupIdentityKey(store, type, id) {
  return store._internalModelForId(normalizeModelName(type), id);
}

export function extractIdentityKey(model) {
  return model._internalModel;
}

// WeakMap is in here because Ember contains a WeakMap polyfill we can
// use, but it's not exposed by public API.
export let WeakMap;
if (window.WeakMap) {
  WeakMap = window.WeakMap;
} else {
  WeakMap = Ember.__loader.require('ember-metal/weak_map').default;
}
