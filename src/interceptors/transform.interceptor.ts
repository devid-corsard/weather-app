import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWeather } from '../weather/dto/weather-response.dto';
import { Weather } from '../weather/weather.entity';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<ResponseWeather> {
        return next.handle().pipe(
            map((weather: Weather) => {
                const data = weather.data;
                if (!data.current) {
                    throw new HttpException(
                        "Can't parse required data",
                        HttpStatus.NOT_FOUND,
                    );
                }
                return {
                    sunrise: data.current.sunrise,
                    sunset: data.current.sunset,
                    temp: data.current.temp,
                    feels_like: data.current.feels_like,
                    pressure: data.current.pressure,
                    humidity: data.current.humidity,
                    uvi: data.current.uvi,
                    wind_speed: data.current.wind_speed,
                };
            }),
        );
    }
}
