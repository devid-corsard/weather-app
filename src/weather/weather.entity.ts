import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ResponseWeather } from './dto/weather-response.dto';

export type Part = 'current' | 'minutely' | 'hourly' | 'daily' | 'alerts';

export type WeatherData = {
    current?: ResponseWeather;
};

@Entity()
export class Weather {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal')
    lat: number;

    @Column('decimal')
    lon: number;

    @Column('text', {
        array: true,
        default: [],
    })
    part: Part[];

    @Column('json')
    data: WeatherData;
}
