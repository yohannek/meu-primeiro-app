import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProdutoLoja } from '../models/produto.loja';

type ProdutoApi = {
  title: string;
  price: number;
};

// type Produto = {
//   nome: string;
//   preco: number;
// };

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private http = inject(HttpClient);

  private readonly API = 'https://fakestoreapi.com/products';
  // private readonly API = 'https://fakestoreapi.com/products-erro';

  buscarProdutos() {
    return this.http.get<ProdutoApi[]>(this.API);
  }

  transformarProdutos(dados: ProdutoApi[]): ProdutoLoja[] {
    return dados.map((produto) => ({
      nome: produto.title,
      preco: produto.price,
    }));
  }
}
