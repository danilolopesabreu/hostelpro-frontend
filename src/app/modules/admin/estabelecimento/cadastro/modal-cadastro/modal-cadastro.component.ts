import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
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
import { Estabelecimento } from '../../estabelecimento.model';
import { id } from '@swimlane/ngx-charts';
import { Usuario } from 'app/modules/admin/usuario/usuario.model';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0User } from '@core/models/user.auth0.model';
import { Role } from '@core/models/role';
import { CategoriaProdutoService } from '@shared/components/categoria-produto/categoria-produto.service';
import { CategoriaProduto } from '@shared/components/categoria-produto/categoria-produto.model';
import { EstabelecimentoService } from '../../estabelecimento.service';
import { TipoEstabelecimentoService } from '../../tipo-estabelecimento.service';
import { TipoEstabelecimento } from '../../tipo-estabelecimento.model';
import { PAPEL_ADMINISTRADOR } from '@shared/modelos/papel-permissao';
import { Router } from '@angular/router';

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

  categorias: CategoriaProduto[] = [];

  // Tipos de estabelecimento
  tiposEstabelecimento: TipoEstabelecimento[] = [];

  tipoSelecionado?: TipoEstabelecimento = undefined;

  private auth = inject(AuthService);
  private user?: Auth0User;
  
  constructor(
      private router: Router
    , private categoriaProdutoService:CategoriaProdutoService
    , private estabelecimentoService:EstabelecimentoService
    , private tipoEstabelecimentoService:TipoEstabelecimentoService){ }

  ngOnInit(): void {

    this.auth.user$.subscribe({
      next: (user) => {
        this.user = Auth0User.fromAuth0(user);
        console.log(user);
      },
      error: (err) => console.error('Erro', err)
    });

    //Estabelecimento 1 é o principal, que contem todos dados de cadastro de exemplo
    this.categoriaProdutoService.listarCategoriasPrincipais(1).subscribe({ 
      next: (categoriasPrincipais) => {
        this.categorias = categoriasPrincipais;
      },
      error: (err) => console.error('Erro', err)
    })

    this.tipoEstabelecimentoService.listar().subscribe({
      next: (tiposDeEstabelecimento) => {
        this.tiposEstabelecimento = tiposDeEstabelecimento;
        console.log("tiposDeEstabelecimento",tiposDeEstabelecimento)
      },
      error: (err) => console.error('Erro', err)
    });

  }

  // Seleção única para tipo
  selecionarTipo(tipo: TipoEstabelecimento) {
    if (this.tipoSelecionado === tipo) {
      this.tipoSelecionado = undefined; // desmarca se clicar novamente
    } else {
      this.tipoSelecionado = tipo;
    }
  }

  categoriasSelecionadas: CategoriaProduto[] = [];

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

    let usuario = new Usuario({
      nome: this.user?.name,
      email: this.user?.email,
      papel: PAPEL_ADMINISTRADOR,
      ativo: true,
      foto: this.user?.picture
    });

    let novoEstabelecimento = new Estabelecimento({
      nome: this.estabelecimentoNome,
      email: this.user?.email,
      tipoEstabelecimento: this.tipoSelecionado,
      usuarios: [usuario],
      categoriaProduto: this.categoriasSelecionadas
    });

    console.log(novoEstabelecimento, usuario);

    this.estabelecimentoService.criar(novoEstabelecimento).subscribe({
      next: (dados) => {
        console.log(dados);

        //nagegar p vendas
        this.router.navigate(['/itens-agrupados']);

        //this.fechar.emit();

      },
      error: (err) => console.error('Erro', err)
    });

  }


}
