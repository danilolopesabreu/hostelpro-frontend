import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProdutoEstabelecimento } from '@shared/components/produto/produto-estabelecimento.model';
import { ProdutoEstabelecimentoService } from '@shared/components/produto/produto-estabelecimento.service';

import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatPaginatorModule } from '@angular/material/paginator';

export interface DialogData {
  estabelecimentoId: number;
}

@Component({
  selector: 'app-novo-produto',
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
  ],
  templateUrl: './novo-produto.component.html',
  styleUrl: './novo-produto.component.scss',
})
export class NovoProdutoComponent {

  novoProdutoEstabelecimento: ProdutoEstabelecimento = new ProdutoEstabelecimento();

  constructor(
    public dialogRef: MatDialogRef<NovoProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private produtoEstabelecimentoService: ProdutoEstabelecimentoService,
  ) {
    this.novoProdutoEstabelecimento.estabelecimentoId = data.estabelecimentoId;
  }

  // Preço com máscara (string), já que o campo do objeto precisa ser number
  precoMascara: any = '';

  moedaOpts = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2
  };

  onSelectFile(event: any) {
    const file = event.target.files[0];
    if (!file) { return; }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.novoProdutoEstabelecimento.imagem = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  salvarProduto() {
    // Converte "R$ 10,20" => 10.20 (number)
    this.novoProdutoEstabelecimento.preco = Number(
      String(this.precoMascara)
        .replace("R$ ", "")
        .replace(/\./g, "")
        .replace(",", ".")
    );

    console.log("Produto salvo:", this.novoProdutoEstabelecimento);

    // aqui você pode enviar ao backend
    // this.service.salvarProduto(this.novoProdutoEstabelecimento).subscribe(...)
  }

}
