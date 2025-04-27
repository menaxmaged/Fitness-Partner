import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module'; // <<== ADD THIS LINE!
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        return { uri };
      },
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    ProductsModule,
    CartModule,
    FavoritesModule, // <<== ADD THIS TOO!
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
