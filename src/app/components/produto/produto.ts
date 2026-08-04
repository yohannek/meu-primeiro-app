import { Component } from '@angular/core';

@Component({
selector: "app-produto",
imports: [],
templateUrl: "./produto.html",
styleUrl: './produto.css',
})
export class Produto {
nome = 'Produto Exemplo';
preco = 149.99;
}