/**
 * Module Dependencies
 */

var _ = require('underscore');
var request = require('superagent');

/**
 * Expose `Client`
 */

module.exports = Client;

/**
 * Initialize Client with token
 * @param {String} token
 */

function Client(token){
  this.token = token;
  this.count = 50;
}

/**
 * API base
 */

Client.base = base = 'https://api.nike.com';

/**
 * APP ID required for request
 */

Client.APP_ID = 'NODE_API_CLIENT';

/**
 * Request required headers
 */

Client.prototype.headers = {
  'appId': Client.APP_ID,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};


/**
 * Get snapshot of user or me.
 * If `userid` is skipped, it will return my snapshot
 *
 * @param {Number} userid (Optional)
 * @param {function} next
 *
 * @api public
 */

Client.prototype.snapshot = function(userid, next){

  var path = '/v2.0/user/snapshot';

  var query = {};

  if(1 == arguments.length){
    next = userid;
    path = path.replace('user', 'me');
  } else{
    query.userUpmid = userid;
  }

  this.get(path, query, next);
};


/**
 * Grab my friends' feed
 *
 * @param {Function} next
 *
 * @api public
 */

Client.prototype.myFriendsFeed = function(next){

  var path = '/v1.0/me/friends/feed';
  // this.get(path, query, next);
  this.getFeed(path, 1, next);

};


/**
 * Grab list of my friends
 *
 * @param {Object} query
 * @param {Function} next
 *
 * @api public
 */

Client.prototype.myFriendsList = function(next){
  var path = '/v1.0/me/friends/all';
  this.getFeed(path, 1, next);
};


/**
 * General call to API
 *
 * @param {String} path
 * @param {Object} query
 * @param {Function} next
 * 
 * @api public
 */

Client.prototype.get = function(path, query, next){

  if(typeof query === 'function'){
    next = query;
    query = {};
  }

  var url = base + path;
  var isV2 = /v2/.test(path);
  var _query = this.getQuery(query, isV2);

  this.request(url, _query, next);

};

/**
 * Handles API call that has multiple pages
 *
 * @api public
 */

Client.prototype.getFeed = function(path, index, next){

  var self = this;
  var query = {
    startIndex: index,
    count: this.count
  };
    
  /**
   * Appending .next to `result`
   */

  var _next = function(err, result){

    if(err) return next(err);

    var nextIndex = index + self.count;

    if(self._checkHasNext(result)){
      result.next = function(next){ return self.getFeed(path, nextIndex, next); };
    }

    next(null, result);
  };

  this.get(path, query, _next);
};


/**
 * Check if the list has more to fetch
 *
 * @api private
 */

Client.prototype._checkHasNext = function(result){
  
  if(result.detail === 'Start index is out of bounds.') return false;

  var listItemCount = 0;
  for(var k in result){
    var v = result[k];
    if(_.isArray(v)){
      listItemCount = Math.max(v.length, listItemCount);
    }
  }

  return listItemCount === this.count;
};


/**
 * Supply query with required fields
 *
 * @param {Object} query
 * @return {Object} _query
 *
 * @api private
 */

Client.prototype.getQuery = function(query, isV2){

  var _query = {
    access_token: this.token,
    locale: 'en_US',
  };

  if(isV2){
    _query.app = Client.APP_ID;
    _query.format = 'json';
  }

  _.extend(_query, query);

  return _query;

};

/**
 * Construct request
 *
 * @param {String} url
 * @param {Object} query
 * @param {Function} next
 *
 * @api private
 */

Client.prototype.request = function(url, query, next){

  request
    .get(url)
    .query(query)
    .set(this.headers)
    .end(function(res){
      if(res.ok){
        next(null, res.body);
      } else {
        next(res.text);
      }
    });

};
