# Nike Plus API Client

Unofficial Nike+ API client for node.js.

Making it easy to access social-related APIs on Nike+ that are not documented on API docs yet.

### Usage

```javascript
var Client = require('nike-plus-api').Client;
var token = '**********************' // Grab one from developer.nike.com

var client = new Client(token):

client.snapshot(function(err, result){

  if(!err){
    console.log(result);
  }

});

client.myFriendsList(function(err, result){

  if(!err){
    grabNext(res, 10);
  }

});

/**
 * Call next page request limit call to `limit`
 */

function grabNext(res, limit){

  if(!limit) return;

  if (res.next){
    res.next(function(err, _res){
      grabNext(_res, --limit);
    });
  }
}

```

### API

  - [Client()](#client)
  - [Client.snapshot()](#clientsnapshotuseridnumbernextfunction)
  - [Client.myFriendsFeed()](#clientmyfriendsfeednextfunction)
  - [Client.myFriendsList()](#clientmyfriendslistqueryobjectnextfunction)
  - [Client.get()](#clientgetpathstringqueryobjectnextfunction)
  - [Client.getFeed()](#clientgetfeed)

### Client(token:String)

  Initialize Client with token

### Client.snapshot(userid:Number, next:function)

  Get snapshot of user or me.
  If `userid` is skipped, it will return my snapshot

### Client.myFriendsFeed(next:Function)

  Grab my friends' feed

### Client.myFriendsList(query:Object, next:Function)

  Grab list of my friends

### Client.get(path:String, query:Object, next:Function)

  General call to API

### Client.getFeed()

  Handles API call that has multiple pages


## TODOs

- Add official methods

## License
MIT
