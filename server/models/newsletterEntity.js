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
var NewsletterEntitySchema = new Schema(
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
  bounceBackAddress:
  {
    type: String,
    required:  true
  },      
  replyToName:
  {
    type: String,
    required:  true
  },    
  replyToEmail:
  {
    type: String,
    required:  true
  },    
  fromAddress:
  {
    type: String,
    /*required:  true*/
  },   
  senderName:
  {
    type: String,
    /*required:  true*/
  }, 
  type:   
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
  segments:
  {
    type: Array,
    default: []
  }, 
  circles:
  {
    type: Array,
    default: []
  },
  modules:
  {
    type: Array,
    default: []
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
  header:
  {
    type: String
  },
  preBody:
  {
    type: String
  },
  postBody:
  {
    type: String
  }, 
  footer:
  {
    type: String
  }
});


NewsletterEntitySchema.pre('save', function(next)
{

  var now = new Date();

  this.updatedAt = now;
  if ( !this.createdAt ) 
  {

      this.createdAt = now;

  }
  
  next();
});



mongoose.model('NewsletterEntity', NewsletterEntitySchema);
