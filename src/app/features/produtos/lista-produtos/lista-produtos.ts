import { Component, signal, computed } from '@angular/core';
import { Produto } from '../produto/produto';

@Component({
  selector: 'app-lista-produtos',
  imports: [Produto],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  produtos = signal([
    { nome: 'Notebook', preco: 3800 },
    { nome: 'Mouse', preco: 179 },
    { nome: 'Caixa de Som', preco: 500 },
  ]);

  exibirProduto(nome: string) {
    console.log('Produto selecionado:', nome);
  }
  adicionarProduto() {
    this.produtos.update((listaAtual) => [
      ...listaAtual,
      { nome: 'Teclado', preco: 250 },
      { nome: 'Batom', preco: 10 },
    ]);
  }
  totalProdutos = computed(() => this.produtos().length);
  valorTotal = computed(() => {
    return this.produtos().reduce((total, item) => total + item.preco, 0);
  });
  substituirProdutos() {
    this.produtos.set([{ nome: 'iphone', preco: 7000 }]);
  }
}
