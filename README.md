# How X do Y?

## Motivation

I am a software engineer and I love copy-and-paste, from code snippet to system design.
Usually, I turn to Stack Overflow for code snippets, and browse through
tech blog posts by different tech companies for system design ideas.

Searching on Stack Overflow is simple, however, searching tech blog posts
among websites is not easy.

For example, to steal how tech giants build a feature store,
I google "Uber feature store", "Airbnb feature store", etc.
It works, but takes me a lot of processing to find the right ones.

I wonder, shouldn't there exist a search engine for this?
You simply type "feature store" and it shows you how Uber, Airbnb, etc
build their feature store **WITH POST LINKS ATTACHED**.

This is why I start How-X-Do-Y.

## Implementation

What's amazing - Feedly has aggregated feeds for engineering blogs.

What's even more amazing - Feedly opens API to access the feed streams.

Here're the steps:
1. Get access token, see [docs](https://developer.feedly.com/v3/developer/).
2. Get feed URL for blog of interest, e.g., `https://eng.uber.com/feed`. See [here](https://github.com/kilimchoi/engineering-blogs/blob/master/engineering_blogs.opml) for a full list.
3. Get feed stream using [Streams API](https://developer.feedly.com/v3/streams/). Note you want to set the `count` parameter to a large number so you get them all.
    ```
    $ curl -H 'Authorization: Bearer A6gt7KEujlAQr2Oz6uPUQyOfEywd5dShAJxtIDX3PzHWWXXbz7pPj15AOoXkqDXIqOHg6EkU4-8pyVU7PMaCAv8ZK4VEAir4mxa-2gQ-rl9Lg2iEFsjHwe4-TtXwVtpVdW3vi0bvLHybR6xNn0V-DdogmhqlQKKa-QfV_QsVy7OKGV2CtfQlDyiG6yM3B8Dg73n_HFAMtc61DSFQuLJpbYli5B3_3jj6hwdIhC5FT7AQwYevxGxER4MSA5iP:feedlydev' https://cloud.feedly.com/v3/streams/contents\?streamId\=feed/https://eng.uber.com/feed/\&count\=500 | jq > uber-posts.json
    ```
4. Retrieve all necessary metadata from the Streams API response and render the site.
5. Also, dump each and every articles, transform into indexes, and upload to meilisearch.
