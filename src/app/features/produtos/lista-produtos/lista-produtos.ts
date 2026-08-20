import { Component, signal, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { ItemCarrinho } from '../../../core/models/item-carrinho';
import { Produto } from '../produto/produto';
import { ProdutoLoja } from '../../../core/models/produto.loja';
import { ProdutosService } from '../../../core/services/produtos.service';

@Component({
  selector: 'app-lista-produtos',
  imports: [Produto, MatButtonModule, RouterLink],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  private produtosService = inject(ProdutosService);
  carrinhoFacade = inject(CarrinhoFacade);

  produtos = signal<ProdutoLoja[]>([]);
  produtoSelecionado = signal<string | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  totalProdutos = computed(() => this.produtos().length);

  valorTotal = computed(() => this.produtos().reduce((total, item) => total + item.preco, 0));

  valorTotalFormatado = computed(() => this.valorTotal().toFixed(2));

  constructor() {
    this.carregarProdutos();

    effect(() => {
      if (typeof document !== 'undefined') {
        document.title = `(${this.totalProdutos()}) Minha Loja`;
      }
    });
  }

  carregarProdutos() {
    this.erro.set(null); // limpa erro anterior
    this.carregando.set(true); // ativa loading
    this.produtosService.buscarProdutos().subscribe({
      next: (dados) => {
        const produtos = this.produtosService.transformarProdutos(dados);
        this.produtos.set(produtos);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        this.erro.set('Erro ao carregar produtos. Verifique sua conexão e tente novamente.');
        this.carregando.set(false);
      },
    });
  }

  exibirProduto(nome: string) {
    this.produtoSelecionado.set(nome);
  }

  adicionarAoCarrinho(produto: ItemCarrinho) {
    this.carrinhoFacade.adicionarProduto(produto);
  }
}
