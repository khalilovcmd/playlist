# Playlist


## technology stack

**front-end**
* angular (v1)
* bootstrap (web app UI)
* lodash

**backend**  
* nodejs
* express (web framework)
* ejs (view engine)
* winston (logging)
* unirest (http requests)
* lodash (collections querying)
* gulp (build)
* mocha, chai and supertest (test, assertion, and route tests)
* bower (client-side package manager)

**database+cache**
* redis (cache + temporary status storage)
* mongodb (usage statistics, events, logs, user's data)

**apis**
* facebook api (read user's feed)
* youtube data api (read videos information)

## sequence diagram

>it runs @ [websequencediagrams](https://www.websequencediagrams.com/), copy and paste it.

```
title PlayList

note over User,Route,Facebook,Db,Redis: User is visiting
User->Route: visits
Route->Route: check for user's cookie
alt 'user' cookie doesn't exist
    Route->User: render login view
else 'user' cookie exists
    Route->Db: get playlist data by 'user' cookie
    Db->Route: return playlist json
    Route->User: render login view
end

note over User,Route,Facebook,Db,Redis: User is logging in
User->Route: log-in
Route->Facebook: prompt user's permissions
alt 'accessToken' retrieved
    Facebook->Route: get user's information
    Route->Route: spawn a worker
    Route->User: render waiting view
    User->Route: poll for playlist..
    Route->Redis: worker update redis
    Route->Route: worker done
    Redis->Route: get playlist
    Route->Db: save playlist + user's info in db
    Db->Route: get playlist
    Route->User: render playlist view
else 'accessToken' is not retrieved
    Facebook->Route: no user token
    Route->User: render error view
end
```

