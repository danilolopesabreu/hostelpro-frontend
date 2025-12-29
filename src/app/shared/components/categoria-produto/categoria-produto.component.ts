import { Component, OnInit } from '@angular/core';
import { CategoriaProdutoService } from './categoria-produto.service';
import { LocalStorageService } from '@shared/services';
import { Estabelecimento } from 'app/modules/admin/estabelecimento/estabelecimento.model';
import { CategoriaProduto } from './categoria-produto.model';

@Component({
  selector: 'app-categoria-produto',
  imports: [],
  templateUrl: './categoria-produto.component.html',
  styleUrl: './categoria-produto.component.scss',
})
export class CategoriaProdutoComponent implements OnInit {

  estabelecimento?:Estabelecimento;
  categoriasProduto:CategoriaProduto[] = [];

  constructor(
    private categoriaProdutoService: CategoriaProdutoService,
    private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.estabelecimento = this.localStorageService.get("estabelecimento");
    this.categoriaProdutoService.listarCategoriasVinculadas(this.estabelecimento?.id as number).subscribe({
      next: categorias => {
        this.categoriasProduto = categorias;
      },
      error: err => {

      }
    });
  }

}
