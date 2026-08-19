import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  // A área administrativa passa a ler dados do usuário autenticado
  private authService = inject(AuthService);

  // Router usado para voltar para a área pública após logout
  private router = inject(Router);

  // Signals simulando indicadores administrativos do sistema.
  totalProdutosCadastrados = signal(20);
  pedidosPendentes = signal(3);
  usuariosCadastrados = signal(8);

  // Computed signal derivado do usuário atual.
  usuarioAtual = this.authService.usuarioAtual;

  // Texto calculado para reforçar o perfil atualmente autenticado
  mensagemPerfil = computed(() => {
    const usuario = this.usuarioAtual();

    if (!usuario) {
      return 'Nenhum usuário autenticado.';
    }

    return `Usuário autenticado como ${usuario.perfil}.`;
  });

  sair() {
    // Logout também pode ser feito a partir da área administrativa
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
