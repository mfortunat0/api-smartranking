import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria')
    private categoriaModel: Model<Categoria>,
    private jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(criarCategoriaDto: CriarCategoriaDto) {
    const { categoria } = criarCategoriaDto;
    const categoriaEncontrada = await this.categoriaModel
      .findOne({
        categoria,
      })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} ja cadastrada`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDto);
    return await categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} nao encontrada`);
    }
    return categoriaEncontrada;
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(
        `Categoria ${categoria} que voce informou nao existe`,
      );
    }

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto })
      .exec();
  }

  async atribuirJogadorCategoria(params): Promise<void> {
    const { categoria, idJogador } = params;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    const jogadorJaCadastradoNaCatagoria = await this.categoriaModel
      .find({
        categoria,
      })
      .where('jogadores')
      .in(idJogador)
      .exec();

    await this.jogadoresService.consultarJogadoresPeloId(idJogador);

    if (!categoriaEncontrada) {
      throw new BadRequestException(
        `Categoria ${categoria} que voce informou nao existe`,
      );
    }

    if (jogadorJaCadastradoNaCatagoria.length > 0) {
      throw new BadRequestException(
        `Jogador ${idJogador} ja cadastrado na categoria ${categoria}`,
      );
    }

    categoriaEncontrada.jogadores.push(idJogador);
    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: categoriaEncontrada })
      .exec();
  }
}
