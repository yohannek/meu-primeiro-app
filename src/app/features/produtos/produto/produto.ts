import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ItemCarrinho } from '../../../core/models/item-carrinho';

@Component({
  selector: 'app-produto',
  imports: [CurrencyPipe, MatButtonModule, MatCardModule],
  templateUrl: './produto.html',
  styleUrl: './produto.css',
})
export class Produto {
  @Input() nome: string = '';
  @Input() preco: number = 0;
  
  @Output() produtoSelecionado = new EventEmitter<string>();
  
  // O evento agora usa o tipo compartilhado ItemCarrinho.
  @Output() produtoAdicionado = new EventEmitter<ItemCarrinho>();
  
  selecionarProduto() {
    this.produtoSelecionado.emit(this.nome);
  }
  
  adicionarAoCarrinho() {
    // O produto enviado ao carrinho segue o modelo compartilhado.
    this.produtoAdicionado.emit({
      nome: this.nome,
      preco: this.preco,
    });
  }
}
