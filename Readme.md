# Mongoose-v-etters

[![Build Status](https://travis-ci.org/nowk/mongoose-v-etters.js.svg?branch=master)](https://travis-ci.org/nowk/mongoose-v-etters.js)
[![Code Climate](https://codeclimate.com/github/nowk/mongoose-v-etters.js.png)](https://codeclimate.com/github/nowk/mongoose-v-etters.js)

Virtual setters and getters for references (eg. post_id for post)

## Install

    npm install mongoose-v-etters

## Usage

    var schema = mongoose.Schema({
      post: {type: ObjectId, ref: 'Post'}
    });

    vetters(schema, 'post');

    var Comment = mongoose.model('Comment', schema);

    Comment.create({post_id: post._id}, function(err, comment) {
      // comment.post    == post
      // comment.post_id == post._id
    });

Chainable:

    var schema = mongoose.Schema({
      post: {type: ObjectId, ref: 'Post'}
      author: {type: ObjectId, ref: 'Post'}
    });

    vetters(schema, 'post')
      .and('author');

    var Comment = mongoose.model('Comment', schema);

    Comment.create({post_id: post._id, author_id: author._id}, function(err, comment) {
      // comment.post      == post
      // comment.post_id   == post._id
      // comment.author    == author
      // comment.author_id == author._id
    });

## License

MIT
