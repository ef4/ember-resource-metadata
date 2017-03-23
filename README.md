# ember-resource-metadata

The [JSONAPI spec](http://jsonapi.org/) allows any resource to have its own `meta` object. Ember Data doesn't support `meta` in this position. This addon exists to fill the gap.

It provides a `Serializer`, a `Service`, and a `Helper` as described in the following sections:

## Serializer

We provide an extended version of Ember Data's `JSONAPISerializer` that:

  - remembers the last-seen per-resource metadata whenever deserializing records
  - serializes per-resource metadata back out to the server
  
To use it, extend your own serializers off of it like:

```js
import Serializer from 'ember-resource-metadata/serializer';
export default Serializer.extend({});

```

## Service

The `resource-metadata` service has the following methods for accessing metadata:

 - `peek(record)`: takes an Ember Data record or any object with a `type` and `id`. Returns an `Ember.Object` representing the record's metadata. Returns undefined if we don't have any metadata for the record.
 - `read(record)`: takes the same input as `peek`, but this always returns an `Ember.Object`, which will be updated to contain the metadata for the record even if it's added at a later time.
 - `write(record, metadata)`: saves all the properties of `metadata` as the metadata for `record`. This is a per-property merge with any prior metadata.
 
 To access these methods, inject the service into a Component, Controller, Route, etc:
 
 ```js
 export default Ember.Component.extend({
   resourceMetadata: Ember.inject.service(),
   actions: {
     bumpVersion() {
       let service = this.get(resourceMetadata);
       let model = this.get('model');
       let meta = service.read(model);
       service.write(model, { version: meta.version + 1 });
     }
   }
 })
 ```

## Helper

The `meta-for-resource` helper is implemented via `read` as defined in the previous section, so you can use it easily from templates:

```hbs
{{#with (meta-for-resource model) as |meta|}}
  Your meta.freshness is {{meta.freshness}}
{{/with}}

```

# Installation

* `git clone <repository-url>` this repository
* `cd ember-resource-metadata`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
