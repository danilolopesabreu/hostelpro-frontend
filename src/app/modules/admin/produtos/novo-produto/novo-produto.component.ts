import { Component, Inject, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CategoriaProdutoService } from '@shared/components/categoria-produto/categoria-produto.service';
import { LocalStorageService } from '@shared';
import { Usuario } from '../../usuario/usuario.model';
import { CategoriaProduto } from '@shared/components/categoria-produto/categoria-produto.model';

export interface DialogData {
  estabelecimentoId: number;
}

@Component({
  selector: 'app-novo-produto',
  imports: [
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
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
  ],
  templateUrl: './novo-produto.component.html',
  styleUrl: './novo-produto.component.scss',
})
export class NovoProdutoComponent implements OnInit {

  novoProdutoEstabelecimento: ProdutoEstabelecimento = new ProdutoEstabelecimento();

  usuarioCadastrado?: Usuario;

  categorias?: CategoriaProduto[];

  constructor(
    public dialogRef: MatDialogRef<NovoProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private produtoEstabelecimentoService: ProdutoEstabelecimentoService,
    private categoriaProdutoService: CategoriaProdutoService,
    private localStorageService: LocalStorageService
  ) {
    this.novoProdutoEstabelecimento.estabelecimentoId = data.estabelecimentoId;
  }

  ngOnInit(): void {

    this.usuarioCadastrado = this.localStorageService.get("usuarioCadastrado");

    this.categoriaProdutoService.listarCategoriasFolhas(this.usuarioCadastrado?.estabelecimentoId as number).subscribe({
      next: categorias => {
        console.log(categorias);
        this.categorias = categorias;
      },
      error: err => {
        console.error('Erro ao consultar categorias prodtuto', err);
      }
    });

  }

  // Preço com máscara (string), já que o campo do objeto precisa ser number
  precoMascara: any = '';

  moedaOpts = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
    precision: 2
  };

  onSelectFile(event: Event, produtoEstabelecimento: ProdutoEstabelecimento) {
    const target = event.target as HTMLInputElement;
    if (!target.files || !target.files[0]) return;

    const file = target.files[0];
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif'];

    if (!supportedTypes.includes(file.type)) {
      console.warn('Tipo de imagem não suportado para resize:', file.type);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      if (!e.target) return;

      const img = new Image();
      img.src = e.target.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 240; // largura e altura desejadas
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Redimensiona a imagem dentro do canvas
        ctx.drawImage(img, 0, 0, size, size);

        // Converte de volta para base64
        produtoEstabelecimento.imagem = canvas.toDataURL(file.type);
      };
    };
  }

  salvarProduto() {
    // Converte "R$ 10,20" => 10.20 (number)
    this.novoProdutoEstabelecimento.preco = Number(
      String(this.precoMascara)
        .replace("R$ ", "")
        .replace(/\./g, "")
        .replace(",", ".")
    );

    this.novoProdutoEstabelecimento.origemCadastro = 'manual';

    this.produtoEstabelecimentoService.criar(this.novoProdutoEstabelecimento).subscribe({
      next: produto => {
        console.log(produto);
      },
      error: err => {
        console.error('Erro ao cadastrar prodtuto', err);
      }
    });

    console.log("Produto salvo:", this.novoProdutoEstabelecimento);

    // aqui você pode enviar ao backend
    // this.service.salvarProduto(this.novoProdutoEstabelecimento).subscribe(...)
  }

  cancelar() {
    console.log('Edição cancelada');
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close(this.novoProdutoEstabelecimento);
  }

}
