import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';

@Controller('desafios')
export class DesafiosController {
  constructor(private desafiosService: DesafiosService) {}

  private logger = new Logger(DesafiosController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto) {
    this.logger.log(`criarDesafioDto: ${JSON.stringify(criarDesafioDto)}`);
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  consultarDesafios() {}

  @Put(':desafio')
  async atualizarDesafio() {}

  @Post(':desafio/partida')
  async atribuirDesafioPartida() {}
}
