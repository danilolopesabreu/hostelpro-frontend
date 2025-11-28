import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@shared/components/loading/loading.service';
import { ProdutoEstabelecimentoService } from '@shared/components/produto/produto-estabelecimento.service';
import { LocalStorageService } from '@shared';
import { Usuario } from '../usuario/usuario.model';
import { ProdutoEstabelecimento } from '@shared/components/produto/produto-estabelecimento.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
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
import { MatDialog } from '@angular/material/dialog';
import { EditarProdutoComponent } from './editar-produto/editar-produto.component';

@Component({
  selector: 'app-produtos',
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
    DatePipe,
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss',
})
export class ProdutosComponent implements OnInit {

  dataSource = new MatTableDataSource<ProdutoEstabelecimento>([]);

  produtos: ProdutoEstabelecimento[] = [];
  produtosFiltrados: ProdutoEstabelecimento[] = [];

  usuarioCadastrado?: Usuario;

  isLoading = true;

  columnDefinitions = [
    { def: 'imagem', label: 'Imagem', type: 'image', visible: true },
    { def: 'nome', label: 'Nome', type: 'text', visible: true },
    { def: 'descricao', label: 'Descricao', type: 'text', visible: true },
    { def: 'preco', label: 'Preço', type: 'currency', visible: true },
    { def: 'situacao', label: 'Situação', type: 'status', visible: true },
    { def: 'actions', label: 'Ações', type: 'actionBtn', visible: true },
  ];

  constructor(
    private produtoEstabelecimentoService: ProdutoEstabelecimentoService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.usuarioCadastrado = this.localStorageService.get("usuarioCadastrado");
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {

    this.produtoEstabelecimentoService.listarProdutosMaisVendidosPorEstabelecimento(this.usuarioCadastrado?.estabelecimentoId)
      .subscribe({
        next: produtos => {
          this.produtos = Array.isArray(produtos) ? produtos : []; this.produtosFiltrados = [...this.produtos];
          this.dataSource.data = this.produtos;
          this.isLoading = false;
        },
        error: err => {
          console.error('Erro ao carregar dados dados', err);
        }
      });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editarProduto(produtoEstabelecimento: ProdutoEstabelecimento) {
    console.log(produtoEstabelecimento)
    const dialogRef = this.dialog.open(EditarProdutoComponent, {
      width: '90vw',
      maxWidth: '100vw',
      data: { produtoEstabelecimento: produtoEstabelecimento },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
      }
    });

  }

  cancelarProduto(produtoEstabelecimento: ProdutoEstabelecimento) {
    //this.openDialog('edit', row);
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
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

        this.produtoEstabelecimentoService.atualizar(produtoEstabelecimento).subscribe({
          next: produtoAtualizado => {
            console.log(produtoAtualizado);
          },
          error: err => {
            console.error('Erro ao atualizar prodtuto', err);
          }
        });
      };
    };

  }


}
