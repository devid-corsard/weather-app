import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            expandVariables: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host:
                process.env.NODE_ENV === 'production'
                    ? process.env.POSTGRES_HOST
                    : 'localhost',
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PW,
            database: process.env.POSTGRES_DB,
            entities: [],
            synchronize: true,
            dropSchema: true,
            autoLoadEntities: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
