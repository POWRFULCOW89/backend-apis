# Backend APIs
A collection of Node.js APIs and microservices, using MongoDB as database and Mongoose as Object Document Mapper.

## Exercise Tracker
The user is able to view and create logs of their training activity with the following schema:

```json
{
  "username": "cowie"
  "description": "Evening run",
  "duration": 60,
  "date": "Thu Jan 27 2022",
  "_id": "5fb5853f734231456ccb3b05"
}
```

## File Metadata
Microservice that allows for quick scanning of file metadata. The service accepts any kind of valid file that supports said data, with the following response schema:

```json
{
  "name": "Image (1)",
  "type": "image/jpeg",
  "size": 51857
}
```

## Request Header Parser
Basic HTTP request header parser implementation. A call to `/api/whoami` returns a JSON object with the following properties:

```json
{
  "ipaddress": "160.20.14.100",
  "language": "en-US,en;q=0.5",
  "software": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"
}
```

## Timestamp Microservice
Service that is able to return the current time or a valid provided one in different formats. The returned JSON schema is as follows:

```json
{
  "unix": 1643316004152, 
  "utc": "Thu, 27 Jan 2022 20:39:02 GMT"
}
```

## URL Shortener
The user provides a valid URL, which is then hashed and saved to MongoDB. A subsequent call to `/api/shorturl/<hash>` redirects to the original URL. The response body is:

```json
{
  "original_url": "https://diegomelo.me",
  "short_url": 7521
}
```
