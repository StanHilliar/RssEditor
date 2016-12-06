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
var EmailModuleSchema = new Schema(
{
  name:
  {
    type: String,
    unique: true,
    required: true
  },
  company:
  {
    type: String,
    required:  true
  }, 
  type:   
  {
    type: String,
    required: true
  },  
  defaultURL:   
  {
    type: String
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
  defaultNumberOfEntries:
  {
    type: String
  },
  ads:
  {
    type: Array,
    default: []
  },  
  adViews:
  {
    type: Array,
    default: []
  },
  views:
  {
    type: Array,
    default: []
  },
  variables:
  {
    type: Array,
    default: []
  },   
  bodyVariables:
  {
    type: Array,
    default: []
  },  
  xmlVariables:
  {
    type: Array,
    default: []
  },
  header:
  {
    type: String
  },
  preBody:
  {
    type: String,
    default: ''
  },
  postBody:
  {
    type: String,
    default: ''
  }, 
  childTagName:
  {
    type: String,
    default: ''
  }, 
  footer:
  {
    type: String
  }
});


EmailModuleSchema.pre('save', function(next)
{

  var now = new Date();

  this.updatedAt = now;
  if ( !this.createdAt ) 
  {

      this.createdAt = now;

  }
  
  next();
});



mongoose.model('EmailModule', EmailModuleSchema);
