import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-produto',
  imports: [CurrencyPipe],
  templateUrl: './produto.html',
  styleUrl: './produto.css',
})

export class Produto {
  @Input() nome: string = '';
  @Input() preco: number = 0;
  @Output() produtoSelecionado = new EventEmitter<string>();
  @Output() produtoAdicionado = new EventEmitter<{
    nome: string;
    preco: number;
  }>();

  selecionarProduto() {
    this.produtoSelecionado.emit(this.nome);
  }
  adicionarAoCarrinho() {
    this.produtoAdicionado.emit({
      nome: this.nome,
      preco: this.preco
    });
  }
}