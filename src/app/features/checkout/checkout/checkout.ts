import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { ItemCarrinho } from '../../../core/models/item-carrinho';

type PedidoFinalizado = {
  codigo: number;
  cliente: string;
  quantidadeItens: number;
  total: number;
  itens: ItemCarrinho[];
};

function nomeSemNumeros(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;

  if (!valor) return null;

  if (/\d/.test(valor)) {
    return { numeroInvalido: true };
  }
  return null;
}

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  carrinhoFacade = inject(CarrinhoFacade);

  //compraFinalizada = signal(false);
  pedidoFinalizado = signal<PedidoFinalizado | null>(null);

  formulario = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3), nomeSemNumeros]),
    email: new FormControl('', [Validators.required, Validators.email]),
    endereco: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  finalizar() {
    this.pedidoFinalizado.set(null);

    if (this.carrinhoFacade.carrinhoVazio()) {
      console.log('Não é possível finalizar uma compra com o carrinho vazio.');
      return;
    }

    if (this.formulario.invalid) {
      console.log('Formulário inválido');
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.value;
    const itens = this.carrinhoFacade.itens();
    const total = this.carrinhoFacade.total();

    const pedido: PedidoFinalizado = {
      codigo: Date.now(),
      cliente: dados.nome ?? '',
      quantidadeItens: itens.length,
      total,
      itens,
    };

    console.log('Compra finalizada com sucesso!');
    console.log('Pedido:', pedido);
    console.log('Dados do formulário:', dados);

    this.carrinhoFacade.limparCarrinho();
    this.formulario.reset();
    this.pedidoFinalizado.set(pedido);
  }
}
