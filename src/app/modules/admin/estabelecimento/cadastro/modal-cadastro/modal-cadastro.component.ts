import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-modal-cadastro',
  imports: [
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  templateUrl: './modal-cadastro.component.html',
  styleUrl: './modal-cadastro.component.scss',
})
export class ModalCadastroComponent {
  @Output() fechar = new EventEmitter<void>();
  estabelecimentoNome: string = '';
  categorias: any[] = [
    { id: 1, nome: 'Bebidas', imagem: 'https://amaretti.com.br/wp-content/uploads/2021/08/BEBIDAS.png' },
    { id: 2, nome: 'Lanches', imagem: 'assets/images/categorias/lanches.jpg' },
    { id: 3, nome: 'Sobremesas', imagem: 'assets/images/categorias/sobremesas.jpg' },
    { id: 4, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 15, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 5, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 6, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 7, nome: 'Bebidas', imagem: 'assets/images/categorias/bebidas.jpg' },
    { id: 8, nome: 'Lanches', imagem: 'assets/images/categorias/lanches.jpg' },
    { id: 9, nome: 'Sobremesas', imagem: 'assets/images/categorias/sobremesas.jpg' },
    { id: 10, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 11, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 12, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 13, nome: 'Petiscos', imagem: 'assets/images/categorias/petiscos.jpg' },
    { id: 14, nome: 'Refeições', imagem: 'assets/images/categorias/refeicoes.jpg' }
  ];

  // Tipos de estabelecimento
  tiposEstabelecimento = [
    { id: 1, nome: 'Hospedagem', imagem: 'assets/images/hospedagem.png' },
    { id: 2, nome: 'Restaurante/Lanchonete', imagem: 'assets/images/restaurante.png' },
    { id: 3, nome: 'Delivery / E-commerce de comida', imagem: 'assets/images/restaurante.png' }
  ];
  tipoSelecionado: any = null;

  // Seleção única para tipo
  selecionarTipo(tipo: any) {
    if (this.tipoSelecionado === tipo) {
      this.tipoSelecionado = null; // desmarca se clicar novamente
    } else {
      this.tipoSelecionado = tipo;
    }
  }

  categoriasSelecionadas: any[] = [];

  toggleCategoria(categoria: any): void {
    const index = this.categoriasSelecionadas.findIndex(c => c.id === categoria.id);
    if (index >= 0) {
      // Já está selecionada → remove
      this.categoriasSelecionadas.splice(index, 1);
    } else {
      // Adiciona à seleção
      this.categoriasSelecionadas.push(categoria);
    }
  }

  isCategoriaSelecionada(categoria: any): boolean {
    return this.categoriasSelecionadas.some(c => c.id === categoria.id);
  }

  onFechar() {
    console.log('Categorias selecionadas:', this.categoriasSelecionadas);
    this.fechar.emit();
  }

  onBackgroundClick(event: MouseEvent) {
    // Não propaga o clique do overlay-content para o background
    if ((event.target as HTMLElement).classList.contains('overlay-background')) {
      // Clicou fora da modal → não fecha
      event.stopPropagation();
      console.log('Clique na área de fundo ignorado.');
    }
  }

  isFormularioValido(): boolean {
    return (
      this.estabelecimentoNome.trim().length > 0 &&
      this.tipoSelecionado !== null &&
      this.categoriasSelecionadas.length > 0
    );
  }

  confirmarCadastro(): void {
    if (this.isFormularioValido()) {
      console.log('Cadastro confirmado:');
      console.log('Nome:', this.estabelecimentoNome);
      console.log('Tipo:', this.tipoSelecionado);
      console.log('Categorias:', this.categoriasSelecionadas);
      // Aqui você pode emitir o evento ou chamar um serviço
    }
  }


}
