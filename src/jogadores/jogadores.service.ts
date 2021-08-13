import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarJogadorDTO } from './dtos/criar-Jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador')
    private jogadorModel: Model<Jogador>,
  ) {}

  async criarAtualizarJogador(
    criarJogadorDTO: CriarJogadorDTO,
  ): Promise<Jogador> {
    const { email } = criarJogadorDTO;

    this.logger.log(`criarJogadorDTO: ${JSON.stringify(criarJogadorDTO)}`);
    const jogadorEncontrado = await this.jogadorModel
      .findOne({
        email,
      })
      .exec();

    if (jogadorEncontrado) {
      return await this.jogadorModel
        .findOneAndUpdate(
          {
            email: criarJogadorDTO.email,
          },
          { $set: criarJogadorDTO },
        )
        .exec();
    } else {
      const jogadorCriado = new this.jogadorModel(criarJogadorDTO);
      return await jogadorCriado.save();
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    return await this.jogadorModel.findOne({ email }).exec();
  }

  async deletarJogador(email: string): Promise<void> {
    return await this.jogadorModel.remove({ email }).exec();
  }
}
