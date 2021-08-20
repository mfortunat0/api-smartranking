import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDTO } from './dtos/atualizar-Jogador.dto';
import { CriarJogadorDTO } from './dtos/criar-Jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador')
    private jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    const { email } = criarJogadorDTO;
    const jogadorEncontrado = await this.jogadorModel
      .findOne({
        email,
      })
      .exec();
    if (jogadorEncontrado) {
      throw new BadRequestException(`jogador com email ${email} ja cadastrado`);
    }
    const jogadorCriado = new this.jogadorModel(criarJogadorDTO);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDTO: AtualizarJogadorDTO,
  ): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel
      .findOne({
        _id,
      })
      .exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`jogador com id ${_id} nao encontrado`);
    }

    return await this.jogadorModel
      .findOneAndUpdate(
        {
          _id,
        },
        { $set: atualizarJogadorDTO },
      )
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloId(_id: string) {
    const jogadorEncontrado = await this.jogadorModel
      .findOne({
        _id,
      })
      .exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`jogador com id ${_id} nao encontrado`);
    }
    return await this.jogadorModel.findById({ _id });
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel
      .findOne({
        _id,
      })
      .exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`jogador com id ${_id} nao encontrado`);
    }
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }
}
