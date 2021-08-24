import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';

@Injectable()
export class DesafiosService {
  constructor(
    private categoriasService: CategoriasService,
    private jogadoresService: JogadoresService,
  ) {}
  private logger = new Logger(DesafiosService.name);

  async criarDesafio(criarDesafioDto: CriarDesafioDto) {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    criarDesafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id === jogadorDto._id,
      );

      if (jogadorFilter.length === 0) {
        throw new BadRequestException(
          `0 id ${jogadorDto._id} nao e um jogador`,
        );
      }
    });

    const solicitanteEhJogadorDaPartida = criarDesafioDto.jogadores.filter(
      (jogador) => jogador._id === criarDesafioDto.solicitante,
    );
    this.logger.log(
      `solicitante Eh Jogador da Partida: ${solicitanteEhJogadorDaPartida}`,
    );

    if (solicitanteEhJogadorDaPartida.length === 0) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!!`,
      );
    }

    const categoriaDoJogador = this.categoriasService.consultarCategoriaPeloId(
      criarDesafioDto.solicitante._id,
    );

    const desafioCriado = new this.desafioModel(criarDesafioDto);
    desafioCriado.categoria = categoriaDoJogador;
    desafioCriado.dataHoraSolicitacao = new Date();
    this.logger.log(
      `DesafioCriado.dataHoraSolicitacao: ${desafioCriado.dataHoraSolicitacao}`,
    );

    desafioCriado.status = DesafioStatus.PENDENTE;
    this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);
    return await desafioCriado.save();
  }
}
