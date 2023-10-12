import { Injectable } from '@nestjs/common';
import { WeatherDto } from './dto/weather.dto';

@Injectable()
export class AppService {
    saveWeatherToDb(params: WeatherDto): string {
        return `Saved to db for lat: ${params.lat}, lon: ${params.lon}, part: ${params.part}`;
    }
    getWeather(params: WeatherDto): string {
        return `JSON for lat: ${params.lat}, lon: ${params.lon}, part: ${params.part}`;
    }
}
