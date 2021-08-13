import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-Jogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private jogadoresService: JogadoresService) {}
  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    return this.jogadoresService.criarAtualizarJogador(criarJogadorDTO);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      return this.jogadoresService.consultarJogadoresPeloEmail(email);
    } else {
      return this.jogadoresService.consultarTodosJogadores();
    }
  }

  @Delete()
  async deletarJogador(@Query('email') email: string): Promise<void> {
    return this.jogadoresService.deletarJogador(email);
  }
}
