import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('get should return', () => {
            expect(
                appController.getWeather({ lat: 10, lon: 9, part: 'daily' }),
            ).toBeDefined();
        });
        it('post should return', () => {
            expect(
                appController.saveWeather({ lat: 10, lon: 9, part: 'daily' }),
            ).toBeDefined();
        });
    });
});
