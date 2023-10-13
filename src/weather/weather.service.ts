import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Part, Weather, WeatherData } from './weather.entity';
import { ArrayContains, Repository } from 'typeorm';
import { WeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);

    constructor(
        @InjectRepository(Weather)
        private readonly weatherRepository: Repository<Weather>,
    ) {}

    async saveWeatherToDb(params: WeatherDto): Promise<string> {
        const data = await this.fetchData(params);
        await this.saveToDb(params, data);
        this.logger.log('Weather succesfully saved into database');
        return 'Succesfully saved';
    }

    async getWeather(params: WeatherDto): Promise<Weather> {
        const { lat, lon, part } = params;
        const partArr = part ? (part.split(',') as Part[]) : [];
        const weather = await this.weatherRepository.findOne({
            where: {
                lat,
                lon,
                part: ArrayContains(partArr),
            },
        });
        if (weather === null) {
            const message =
                'Weather with these parameters not found in database';
            this.logger.warn(message);
            throw new HttpException(message, HttpStatus.NOT_FOUND);
        }
        this.logger.log('Weather succesfully finded in database');
        return weather;
    }

    private async fetchData(params: WeatherDto): Promise<WeatherData> {
        const { lat, lon, part } = params;
        const res = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${process.env.API_KEY}`,
        );
        if (res.status === 400) {
            const error: { message: string } = await res.json();
            this.logger.warn('API request failed cause of:', error.message);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        if (!res.ok) {
            this.logger.warn('API request failed unexpected');
            throw new HttpException(
                `Failed to fetch weather data with latitude: ${lat}, longtitude: ${lon}, exclude parts: ${part}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        this.logger.log('Weather succesfully fetched from weather service');
        return res.json();
    }

    private async saveToDb(params: WeatherDto, data: WeatherData) {
        const { lat, lon, part } = params;
        const partArr = part ? (part.split(',') as Part[]) : [];
        const weather = this.weatherRepository.create({
            lat,
            lon,
            part: partArr,
            data,
        });
        try {
            await this.weatherRepository.save(weather);
        } catch (e) {
            this.logger.error('Failed to save weather data into db', e);
            throw new HttpException(
                'Failed to save weather data',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
