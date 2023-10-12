import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { WeatherDto } from './dto/weather.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getWeather(@Query() qParams: WeatherDto): string {
        return this.appService.getWeather(qParams);
    }

    @Post()
    saveWeather(@Query() qParams: WeatherDto): string {
        return this.appService.saveWeatherToDb(qParams);
    }
}
