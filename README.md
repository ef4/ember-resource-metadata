# ember-resource-metadata

The [JSONAPI spec](http://jsonapi.org/) allows any resource to have its own `meta` object. Ember Data doesn't support `meta` in this position. This addon exists to fill the gap.

It provides an `AdapterMixin`, a `SerializerMixin`, a `Service`, and a `Helper` as described in the following sections:

## AdapterMixin

We provide a mixin that you can apply to Ember Data's `JSONAPIAdapter` that stores per-resource metadata into a service. Use it like:

```js
import AdapterMixin from 'ember-resource-metadata/adapter-mixin';
import DS from 'ember-data';
export default DS.JSONAPIAdapter.extend(AdapterMixin);
```

It expects to receive JSONAPI-compliant responses from the server (because it will expect to find `/data/id`, `/data/type`, and `/data/meta` in the response).

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
       let service = this.get('resourceMetadata');
       let model = this.get('model');
       let meta = service.read(model);
       service.write(model, { version: meta.version + 1 });
     }
   }
 })
 ```

## SerializerMixin

We provide a mixin that you can apply to Ember Data's `JSONAPISerializer` that writes per-resource metadata back out to the server.

Use it like:

```js
import SerializerMixin from 'ember-resource-metadata/serializer-mixin';
import DS from 'ember-data';
export default DS.JSONAPISerializer.extend(SerializerMixin);

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

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
