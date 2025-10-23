import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';
import { FUNCIONARIO_REPOSITORY } from '../../../infrastructure/providers/funcionario.provider';
import { FuncionarioRepository } from '../../../domain/repositories/funcionario.repository.interface';

@Injectable()
export class FuncionarioGuard implements CanActivate {
  constructor(
    @Inject(FUNCIONARIO_REPOSITORY)
    private readonly funcionarioRepository: FuncionarioRepository,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    // Permite acesso para funcionários E clientes
    if (user.tipo_usuario === 'cliente' || user.tipo_usuario === 'funcionario') {
      return true;
    }

    // Se for funcionário, verifica se existe no repositório
    if (user.tipo_usuario === 'funcionario') {
      try {
        const funcionario = await this.funcionarioRepository.findByEmail(user.email);
        if (!funcionario) {
          throw new UnauthorizedException('Funcionário não encontrado');
        }
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }
        throw new UnauthorizedException('Erro ao verificar funcionário');
      }
    }

    return true;
  }
}