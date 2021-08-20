import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    JogadoresModule,
    MongooseModule.forRoot('mongodb://database:27017/smartranking', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
