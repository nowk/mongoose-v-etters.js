/* jshint node: true */

process.env.NODE_ENV = 'test';

var assert = require('chai').assert;
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var vetters = require('..');

describe('mongoose-v-etters', function() {
  before(function(done) {
    mongoose.connect("mongodb://127.0.0.1:27017/mongoose_assoc_test");
    mongoose.connection.once('connected', done);
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  beforeEach(function() {
    var postSchema = mongoose.Schema({});
    mongoose.model('Post', postSchema);
  });

  afterEach(function(done) {
    var models = Object.keys(mongoose.models);
    var i = 0;
    var len = models.length;
    models.forEach(function(m) {
      var model = mongoose.models[m];
      model.remove({}, function(err) {
        if (i>=len-1) {
          mongoose.models = {};
          done();
        }
        i++;
      });
    });
  });

  it("creates virtual `<ref>_id` setters and getters", function(done) {
    var schema = mongoose.Schema({
      post: {type: ObjectId, ref: 'Post'}
    });
    vetters(schema, 'post');
    var Comment = mongoose.model('Comment', schema);

    mongoose.models.Post.create({}, function(err, post) {
      Comment.create({post_id: post._id}, function(err, comment) {
        Comment.findOne({_id: comment._id})
          .populate('post')
          .exec(function(err, comment) {
            var postId = post._id.toString();
            assert.equal(comment.post._id.toString(), postId);
            assert.equal(comment.post_id.toString(), postId);
            done();
          });
      });
    });
  });

  it("is chainable", function(done) {
    var schema = mongoose.Schema({
      post: {type: ObjectId, ref: 'Post'},
      other_post: {type: ObjectId, ref: 'Post'}
    });
    vetters(schema, 'post')
      .and('other_post');
    var Comment = mongoose.model('Comment', schema);

    mongoose.models.Post.create({}, function(err, post) {
      Comment.create({post_id: post._id, other_post_id: post._id}, function(err, comment) {
        Comment.findOne({_id: comment._id})
          .populate('post other_post')
          .exec(function(err, comment) {
            var postId = post._id.toString();
            assert.equal(comment.post._id.toString(), postId);
            assert.equal(comment.post_id.toString(), postId);
            assert.equal(comment.other_post._id.toString(), postId);
            assert.equal(comment.other_post_id.toString(), postId);
            done();
          });
      });
    });
  });
});

