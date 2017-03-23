import normalizeModelName from "ember-data/-private/system/normalize-model-name";

export function lookupIdentityKey(store, type, id) {
  return store._internalModelForId(normalizeModelName(type), id);
}

export function extractIdentityKey(model) {
  return model._internalModel;
}
