import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    JogadoresModule,
    MongooseModule.forRoot('mongodb://database:27017/smartranking', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
