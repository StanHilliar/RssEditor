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
var EmailSchema = new Schema(
{
  name:
  {
    type: String,
    unique: true,
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
  segment:
  {
    type: String,
    required:  true
  }, 
  subject:
  {
    type: String,
    required:  true
  },
  scheduledDate:
  {
    type: Date
  },  
  scheduledTime:
  {
    type: Date
  },
  newsletterEntity:
  {
    type: String
  }, 
  eloquaEmail:
  {
    type: String
  },  
  eloquaCampaign:
  {
    type: String
  },   
  eloquaFolder:
  {
    type: String,
    required:  true
  },    
  eloquaCampaignFolder:
  {
    type: String,
    required:  true
  },  
  eloquaFooter:
  {
    type: String,
    required:  true
  },  
  eloquaHeader:
  {
    type: String,
    required:  true
  },  
  eloquaEmailGroup:
  {
    type: String,
    required:  true
  },
  data:
  [{
     state: String,
     numberOfEntries: String, 
     data: Array
  }],
  positions:
  {
    type: Array,
    default: []
  },
  status:
  {
    type: String
  }

});


EmailSchema.pre('save', function(next)
{

  var now = new Date();

  this.updatedAt = now;
  if ( !this.createdAt ) 
  {
    this.createdAt = now;
  }
  
  next();
});



mongoose.model('Email', EmailSchema);
