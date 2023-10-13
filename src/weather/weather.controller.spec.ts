import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherDto } from './dto/weather.dto';
import { Part, Weather } from './weather.entity';

const mockWeather: Weather = {
    id: 1,
    lon: 0,
    lat: 0,
    part: [],
    data: {
        current: {
            sunrise: 1684926645,
            sunset: 1684977332,
            temp: 292.55,
            feels_like: 292.87,
            pressure: 1014,
            humidity: 89,
            uvi: 0.16,
            wind_speed: 3.13,
        },
    },
};
describe('WeatherController', () => {
    let weatherController: WeatherController;
    let weatherService: WeatherService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WeatherController],
            providers: [
                WeatherService,
                {
                    provide: WeatherService,
                    useValue: {
                        saveWeatherToDb: jest
                            .fn()
                            .mockResolvedValue('Succesfully saved'),
                        getWeather: jest.fn().mockImplementation(
                            (dto: WeatherDto): Promise<Weather> =>
                                Promise.resolve({
                                    ...mockWeather,
                                    lon: dto.lon,
                                    lat: dto.lat,
                                    part: dto.part.split(',') as Part[],
                                }),
                        ),
                    },
                },
            ],
        }).compile();

        weatherController = module.get<WeatherController>(WeatherController);
        weatherService = module.get<WeatherService>(WeatherService);
    });

    it('should be defined', () => {
        expect(weatherController).toBeDefined();
    });

    describe('getWeather()', () => {
        it('Should get weather', () => {
            const weatherDto = {
                lat: 10.66,
                lon: 13.55,
                part: 'minutely,hourly',
            };
            expect(weatherController.getWeather(weatherDto)).resolves.toEqual({
                ...mockWeather,
                lon: weatherDto.lon,
                lat: weatherDto.lat,
                part: weatherDto.part.split(','),
            });
        });
    });

    describe('saveWeather()', () => {
        it('Should save weather', () => {
            const weatherDto = {
                lat: 10.66,
                lon: 13.55,
                part: 'minutely,hourly',
            };
            expect(weatherController.saveWeather(weatherDto)).resolves.toEqual(
                'Succesfully saved',
            );
        });
    });
});
