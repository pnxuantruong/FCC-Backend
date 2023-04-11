# Timestamp Microservice


This is the project's code which edited from boilerplate code for the Timestamp Microservice project. Instructions for building project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice

## Replit implementation
[![Run on Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-timestamp)](https://boilerplate-project-timestamp.pnxuantruong.repl.co)

## Usage

| Request | Descriptions |
| ----- | -----|
| GET `/api` | Return a date object with unix timestamp and UTC timestamp of the current timestamp |
| GET `/api/{dateParameter}` | Return a date object of the informed timestamp (unix or UTC ISO-8601) |

### Example usage:
* https://boilerplate-project-timestamp.pnxuantruong.repl.co/api
* https://boilerplate-project-timestamp.pnxuantruong.repl.co/api/2015-12-25
* https://boilerplate-project-timestamp.pnxuantruong.repl.co/api/1451001600000

### Example output: 
* `{"unix":1451001600000, "utc":"Fri, 25 Dec 2015 00:00:00 GMT"}`
* `{"error" : "Invalid Date" }`
