import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { UsersModule } from '@/api/users/users.module';
import { LoggerMiddleware } from '@/common/middlewares/logger.middleware';
import { TypeOrmModuleOptions } from '@/common/typeorm';

import { AuthModule } from './api/auth/auth.module';
import { ChatsModule } from './api/chats/chats.module';
import { CommentsModule } from './api/comments/comments.module';
import { FamsModule } from './api/fams/fams.module';
import { FeedsModule } from './api/feeds/feeds.module';
import { GroupsModule } from './api/groups/groups.module';
import { MediasModule } from './api/medias/medias.module';
import { MembersModule } from './api/members/members.module';
import { ToursModule } from './api/tours/tours.module';
import { EmailOptions } from './common/config/emailConfig';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import {
	ENV_THROTTLER_LIMIT,
	ENV_THROTTLER_TTL,
} from './constants/env-keys.const';

@Module({
	imports: [
		MailerModule.forRootAsync(EmailOptions),
		ConfigModule.forRoot({
			envFilePath: [`${__dirname}/../.${process.env.NODE_ENV}.env`],
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
		UsersModule,
		MembersModule,
		AuthModule,
		GroupsModule,
		FamsModule,
		FeedsModule,
		MediasModule,
		CommentsModule,
		ToursModule,
		ChatsModule,
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => [
				{
					ttl: config.get<number>(ENV_THROTTLER_TTL, { infer: true }),
					limit: config.get<number>(ENV_THROTTLER_LIMIT, { infer: true }),
				},
			],
		}),
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerBehindProxyGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
