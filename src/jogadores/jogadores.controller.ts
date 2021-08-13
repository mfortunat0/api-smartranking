import { Body, Controller, Post } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-Jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  @Post()
  async criarAtualizarJogador(@Body() criarJogador: CriarJogadorDTO) {
    const { email, nome, telefoneCelular } = criarJogador;
    return '';
  }
}
