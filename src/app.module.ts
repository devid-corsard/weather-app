import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from './weather/weather.module';
import { Weather } from './weather/weather.entity';

const isProd = process.env.NODE_ENV === 'production';
const HOST = isProd ? process.env.POSTGRES_HOST : 'localhost';
const SYNC = !isProd;

@Module({
    imports: [
        ConfigModule.forRoot({
            expandVariables: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PW,
            database: process.env.POSTGRES_DB,
            entities: [Weather],
            synchronize: SYNC,
        }),
        WeatherModule,
    ],
})
export class AppModule {}
