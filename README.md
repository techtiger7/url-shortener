# URL Shortener

Start the API and DB using Docker:

```
docker-compose up
```

Now the API should be available on port `8080`:

```
curl localhost:8080/api/shorturl/1    # 200 - yay!
curl localhost:8080/api/shorturl/1000 # 404
curl localhost:8080/api/status        # 200 - status check
```
