import { isPlatformBrowser } from '@angular/common';
import { Injectable, computed, signal, inject, PLATFORM_ID } from '@angular/core';

type PerfilUsuario = 'usuario' | 'admin';

type Usuario = {
  email: string;
  perfil: PerfilUsuario;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private readonly chaveUsuario = 'minha-loja-usuario';
  private readonly chaveToken = 'minha-loja-token';

  private usuario = signal<Usuario | null>(this.carregarUsuarioSalvo());
  private tokenJwt = signal<string | null>(this.carregarTokenSalvo());

  usuarioAtual = computed(() => this.usuario());
  estaLogado = computed(() => this.usuario() !== null && this.tokenJwt() !== null);
  ehAdmin = computed(() => this.usuario()?.perfil === 'admin');
  token = computed(() => this.tokenJwt());

  login(email: string, senha: string): boolean {
    if (!email || !senha) {
      return false;
    }

    // Regra: e-mail perfil será admin: admin@email.com . Outro e-mail: usuario comum.
    const perfil: PerfilUsuario = email === 'admin@email.com' ? 'admin' : 'usuario';

    const usuarioLogado: Usuario = { email, perfil };

    const tokenSimulado =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiJhbHVub0B0ZXN0ZS5jb20iLCJwZXJmaWwiOiJ1c3VhcmlvIn0.' +
      'assinatura-simulada';

    this.usuario.set(usuarioLogado);
    this.tokenJwt.set(tokenSimulado);
    this.salvarAutenticacao(usuarioLogado, tokenSimulado);

    return true;
  }

  logout() {
    this.usuario.set(null);
    this.tokenJwt.set(null);
    this.limparAutenticacaoSalva();
  }

  obterToken(): string | null {
    return this.tokenJwt();
  }

  obterPerfil(): PerfilUsuario | null {
    return this.usuario()?.perfil ?? null;
  }

  private estaNoNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private carregarUsuarioSalvo(): Usuario | null {
    if (!this.estaNoNavegador()) {
      return null;
    }
    const dadosSalvos = localStorage.getItem(this.chaveUsuario);

    if (!dadosSalvos) {
      return null;
    }

    try {
      return JSON.parse(dadosSalvos) as Usuario;
    } catch {
      return null;
    }
  }

  private carregarTokenSalvo(): string | null {
    if (!this.estaNoNavegador()) {
      return null;
    }
    return localStorage.getItem(this.chaveToken);
  }

  private salvarAutenticacao(usuario: Usuario, token: string) {
    if (!this.estaNoNavegador()) {
      return;
    }
    localStorage.setItem(this.chaveUsuario, JSON.stringify(usuario));
    localStorage.setItem(this.chaveToken, token);
  }

  private limparAutenticacaoSalva() {
    if (!this.estaNoNavegador()) {
      return;
    }
    localStorage.removeItem(this.chaveUsuario);
    localStorage.removeItem(this.chaveToken);
  }
}
