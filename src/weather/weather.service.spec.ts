import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ArrayContains, Repository } from 'typeorm';
import { Part, Weather } from './weather.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WeatherDto } from './dto/weather.dto';

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

describe('WeatherService', () => {
    let service: WeatherService;
    let repository: Repository<Weather>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    expandVariables: true,
                }),
            ],
            providers: [
                WeatherService,

                {
                    provide: getRepositoryToken(Weather),
                    useValue: {
                        create: jest
                            .fn()
                            .mockImplementation((weather: Weather) => ({
                                ...mockWeather,
                                lat: weather.lat,
                                lon: weather.lon,
                                part: weather.part,
                            })),

                        findOne: jest.fn().mockResolvedValue(mockWeather),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<WeatherService>(WeatherService);
        repository = module.get<Repository<Weather>>(
            getRepositoryToken(Weather),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('saveWeatherToDb()', () => {
        it('should call save with the passed value', async () => {
            const weatherDto = {
                lat: 10.66,
                lon: 13.55,
                part: 'minutely,hourly',
            };
            const repoSpy = jest.spyOn(repository, 'save');
            const resp = await service.saveWeatherToDb(weatherDto);
            expect(repoSpy).toBeCalledWith({
                ...mockWeather,
                lon: weatherDto.lon,
                lat: weatherDto.lat,
                part: weatherDto.part.split(',') as Part[],
            });
            expect(resp).toEqual('Succesfully saved');
        });
    });

    describe('getWeather()', () => {
        it('should retun single weather', () => {
            const weatherDto = {
                lat: 10.66,
                lon: 13.55,
                part: 'minutely,hourly',
            };
            const repoSpy = jest.spyOn(repository, 'findOne');
            expect(service.getWeather(weatherDto)).resolves.toEqual(
                mockWeather,
            );
            expect(repoSpy).toBeCalledWith({
                where: {
                    lon: weatherDto.lon,
                    lat: weatherDto.lat,
                    part: ArrayContains(weatherDto.part.split(',') as Part[]),
                },
            });
        });
    });
});
