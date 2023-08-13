import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@/common/typeorm';
import { UsersModule } from '@/api/users/users.module';
import { LoggerMiddleware } from '@/common/middlewares/logger.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`${__dirname}/../.${process.env.NODE_ENV}.env`],
			isGlobal: true,
		}),
		//TypeOrmModule.forRoot(typeORMConfig),
		TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
