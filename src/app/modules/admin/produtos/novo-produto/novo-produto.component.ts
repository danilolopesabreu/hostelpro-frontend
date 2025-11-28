import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProdutoEstabelecimento } from '@shared/components/produto/produto-estabelecimento.model';
import { ProdutoEstabelecimentoService } from '@shared/components/produto/produto-estabelecimento.service';

export interface DialogData {
  estabelecimentoId: number;
}

@Component({
  selector: 'app-novo-produto',
  imports: [],
  templateUrl: './novo-produto.component.html',
  styleUrl: './novo-produto.component.scss',
})
export class NovoProdutoComponent {
  
  novoProdutoEstabelecimento:ProdutoEstabelecimento = new ProdutoEstabelecimento()

  constructor(
      public dialogRef: MatDialogRef<NovoProdutoComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private produtoEstabelecimentoService: ProdutoEstabelecimentoService,
    ){
      this.novoProdutoEstabelecimento.estabelecimentoId = data.estabelecimentoId;
    }

}
