/* jshint node: true */

/*
 * create virual setters for references
 *
 * eg post_id for post
 *
 * @param {Schema} schema
 * @param {String} refName
 * @return {Schema}
 * @api public
 */

module.exports = function vetters(schema, refName) {
  var name = refName+'_id';
  schema.virtual(name)
    .get(function() {
      var ref = this[refName];
      if (ref && '_id' in ref) {
        return ref._id;
      }
      return ref;
    })
    .set(function(value) {
      this[refName] = value;
    });

  this.and = vetters.bind(null, schema);
  return this;
};

