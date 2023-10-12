export class WeatherDto {
    readonly lat: number;
    readonly lon: number;
    readonly part?: Part;
}

type Part = 'current' | 'minutely' | 'hourly' | 'daily' | 'alerts';
