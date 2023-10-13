# Weather App

##### To run in docker:
```shell
docker compose up
```
the app shoud now listen on port 8800,
postgress port 5432

##### Request examples:
- to save data in db:
```shell
curl -X POST 'localhost:8800/?lat=10&lon=63&part=hourly,daily'
```
example output:
```
Succesfully saved
```
- to recieve saved data from database:
```shell
curl 'localhost:8800/?lat=10&lon=63&part=hourly,daily'
```
example output:
```json
{
    "sunrise": 1697160972,
    "sunset": 1697203934,
    "temp": 301.86,
    "feels_like": 304.6,
    "pressure": 1011,
    "humidity": 66,
    "uvi": 7.91,
    "wind_speed": 2.3
}
```
- provide invalid data in post request:
```shell
curl -X POST 'localhost:8800/?lat=10&lon=663
```
example output:
```json
{
    "statusCode":400,
    "message":"wrong longitude"
}
```
- try to get data that was not saved:

```shell
curl 'localhost:8800/?lat=20&lon=20
```
example output:
```json
{
    "statusCode": 404,
    "message": "Weather with these parameters not found in database"
}
```
- try to get data with invalid parameters:

```shell
curl 'localhost:8800/?lat=20
```
example output:
```json
{
    "message":["lon must be a number string"],
    "error":"Bad Request",
    "statusCode":400
}
```

##### To run for development or testing:
 - run the db in docker:
 ```shell
 docker compose up postgres
 ```
 - run tests:
 ```shell
 npm run test
 ```
- run in watch mode (app start listening on port 8888):
 ```shell
 npm run start:dev
 ```

#### Requirements
Створити проджект на nest який буде фетчити дані із
https://openweathermap.org/api/one-call-3#current
І записувати в БД
Продежект повинен мати 2 доступні АПІ
 - POST який приймає lat, lon, part витягує дані із weatherAPI і записує в БД
 - GET який приймає дані lat, lon і part і по цим даним витягує дані із БД і повертає
у відповіді
Вимоги до проджекта
 - для GET АПІ використовувати interceptor nest для форматування відповіді у вигляді
{
      "sunrise":1684926645,
      "sunset":1684977332,
      "temp":292.55,
      "feels_like":292.87,
      "pressure":1014,
      "humidity":89,
      "uvi":0.16,
      "wind_speed":3.13
}
 - продект повинен мати Dockerfile і запускатись під докером
 - в якості БД використовувати Postgres дані можна зберігати в JSON форматі
 - unit tests опціонально
