'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    //crypto = require('crypto');


/**
 * User Schema
 */
var EmailTemplateSchema = new Schema(
{

  type:   
  {
    type: String,
    required: true
  },
  name:
  {
    type: String,
    required: true
  },
  createdAt:
  {
    type: Date
  },
  createdBy:
  {
    type: String
  },
  updatedAt:
  {
    type: Date
  },
  updatedBy:
  {
    type: String
  },
  source:
  {
    type: String
  }
});


EmailTemplateSchema.pre('save', function(next)
{
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});



mongoose.model('EmailTemplate', EmailTemplateSchema);
