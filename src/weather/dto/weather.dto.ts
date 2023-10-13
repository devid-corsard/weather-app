import { IsNumberString } from 'class-validator';

export class WeatherDto {
    @IsNumberString()
    readonly lat: number;

    @IsNumberString()
    readonly lon: number;

    readonly part?: string;
}
