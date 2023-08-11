import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from '@/common/typeorm';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`${__dirname}/../.${process.env.NODE_ENV}.env`],
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync(typeORMConfig),
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
// TODO config module 설정
// TODO TypeOrmModule module 설정
