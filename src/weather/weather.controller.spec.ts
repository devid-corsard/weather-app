import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from './weather.entity';

describe('WeatherController', () => {
    let controller: WeatherController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Weather])],
            controllers: [WeatherController],
            providers: [WeatherService],
        }).compile();

        controller = module.get<WeatherController>(WeatherController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should do some', () => {
        expect(
            controller.getWeather({
                lat: 10.66,
                lon: 13.55,
                part: 'minutely,hourly',
            }),
        ).toBe('');
    });
});
