import { Injectable, signal, computed } from '@angular/core';

  @Injectable({
    providedIn: 'root',
  })
  export class CarrinhoService {
    // STATE (GLOBAL)
    private carrinho = signal<{ nome: string; preco: number }[]>([]);

    // SELECTORS
    itens = computed(() => this.carrinho());
    quantidade = computed(() => this.carrinho().length);
    total = computed(() => this.carrinho().reduce((total, item) => total + item.preco, 0));

    // ACTIONS
    adicionar(produto: { nome: string; preco: number }) {
      this.carrinho.update((lista) => [...lista, produto]);
    }
    limpar() {
      this.carrinho.set([]);
    }
  }