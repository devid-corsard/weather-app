import { Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { WeatherDto } from './dto/weather.dto';
import { Weather } from './weather.entity';

@Controller()
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @UseInterceptors(TransformInterceptor)
    @Get()
    getWeather(@Query() qParams: WeatherDto): Promise<Weather> {
        return this.weatherService.getWeather(qParams);
    }

    @Post()
    saveWeather(@Query() qParams: WeatherDto): Promise<string> {
        return this.weatherService.saveWeatherToDb(qParams);
    }
}
