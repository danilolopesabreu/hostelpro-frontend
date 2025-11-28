import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProdutoEstabelecimento } from '@shared/components/produto/produto-estabelecimento.model';
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
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProdutoEstabelecimentoService } from '@shared/components/produto/produto-estabelecimento.service';

export interface DialogData {
  produtoEstabelecimento: ProdutoEstabelecimento;
}

@Component({
  selector: 'app-editar-produto',
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
  templateUrl: './editar-produto.component.html',
  styleUrl: './editar-produto.component.scss',
})
export class EditarProdutoComponent {
  
  produtoEstabelecimento: ProdutoEstabelecimento = new ProdutoEstabelecimento();

  constructor(
    public dialogRef: MatDialogRef<EditarProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private produtoEstabelecimentoService: ProdutoEstabelecimentoService,
  ){
    this.produtoEstabelecimento = data.produtoEstabelecimento;
  }
  
  salvarProduto() {
    console.log('Produto atualizado:', this.produtoEstabelecimento);
    // Aqui você pode chamar o serviço para atualizar no backend

    this.produtoEstabelecimentoService.atualizar(this.produtoEstabelecimento).subscribe({
      next: produtoAtualizado => {
        console.log(produtoAtualizado);
      },
      error: err => {
        console.error('Erro ao atualizar prodtuto', err);
      }
    });

  }

  cancelar() {
    console.log('Edição cancelada');
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close(this.produtoEstabelecimento);
  }

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

}
