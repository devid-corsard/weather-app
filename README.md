# Weather App

##### To run in docker:
```shell
docker compose up
```
the app shoud now listen on port 8800,
postgress port 5432

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
