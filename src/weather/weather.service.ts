import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Part, Weather, WeatherData } from './weather.entity';
import { ArrayContains, Repository } from 'typeorm';
import { WeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService {
    constructor(
        @InjectRepository(Weather)
        private readonly weatherRepository: Repository<Weather>,
    ) {}

    async saveWeatherToDb(params: WeatherDto): Promise<string> {
        const data = await this.fetchData(params);
        await this.saveToDb(params, data);
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
            throw new HttpException(
                'Weather with these parameters not found in database',
                HttpStatus.NOT_FOUND,
            );
        }
        return weather;
    }

    private async fetchData(params: WeatherDto): Promise<WeatherData> {
        const { lat, lon, part } = params;
        const res = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${process.env.API_KEY}`,
        );
        if (res.status === 400) {
            const error: { message: string } = await res.json();
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        if (!res.ok) {
            throw new HttpException(
                `Failed to fetch weather data with latitude: ${lat}, longtitude: ${lon}, exclude parts: ${part}`,
                HttpStatus.BAD_REQUEST,
            );
        }
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
            console.log(e);
            throw new HttpException(
                'Failed to save weather data',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
