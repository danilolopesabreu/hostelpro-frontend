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
import { ItensAgrupadosComponent } from '@shared/components/itens-agrupados/itens-agrupados.component';
import { LoadingService } from '@shared/components/loading/loading.service';
import { of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ItensAgrupados } from '@shared/modelos/itens-agrupados.model';
import { ItensAgrupadosService } from '@shared/components/itens-agrupados/itens-agrupados.service';

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
    MatAutocompleteModule,
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

  mostrarTelaNovoEstabelecimento: boolean = true;
  mostrarTelaItensAgrupados: boolean = false;

  estabelecimentoCadastrado?: Estabelecimento;

  umItemAgrupado: ItensAgrupados = new ItensAgrupados();
  itensAgrupadosAdicionados: ItensAgrupados[] = [];

  itensAgrupadosDe: string = "";
  itensAgrupadosAte: string = "";
  itensAgrupadosQtdAndares: number = 1;

  private auth = inject(AuthService);
  private user?: Auth0User;

  constructor(
    private router: Router
    , private categoriaProdutoService: CategoriaProdutoService
    , private estabelecimentoService: EstabelecimentoService
    , private tipoEstabelecimentoService: TipoEstabelecimentoService
    , private loading: LoadingService
    , private itensAgrupadosService: ItensAgrupadosService) { }

  ngOnInit(): void {

    this.loading.runWithLoading({
      dados1: this.auth.user$.pipe(take(1)),
      dados2: this.categoriaProdutoService.listarCategoriasPrincipais(1),
      dados3: this.tipoEstabelecimentoService.listar()
    }).subscribe({
      next: resultado => {
        console.log('Resultado do forkJoin:', resultado);
        this.user = resultado.dados1;
        this.categorias = resultado.dados2;
        this.tiposEstabelecimento = resultado.dados3;
      },
      error: err => {
        console.error('Erro no forkJoin:', err);
      }
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

    this.loading.runWithLoading({
      estabelecimentoCadastrado: this.estabelecimentoService.criar(novoEstabelecimento)
    }).subscribe({
      next: resultado => {
        this.estabelecimentoCadastrado = resultado.estabelecimentoCadastrado;
        console.log(this.estabelecimentoCadastrado);

        if (this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome === 'pedido') {
          this.router.navigate(['/vendas']);
          this.fechar.emit();
        }

        this.mostrarTelaNovoEstabelecimento = false;
        this.mostrarTelaItensAgrupados = true;
      },
      error: err => {
        console.error('Erro no forkJoin:', err);
      }
    });

  }

  mensagemErro: string = '';
  mensagemAjuda: string = '';

  removerItem(index: number): void {
    this.itensAgrupadosAdicionados.splice(index, 1);
  }

  removerTodos(): void {
    this.itensAgrupadosAdicionados = [];
  }

  isFormularioItensAgrupadoValido():boolean{
    return this.itensAgrupadosAdicionados.length > 0;
  }

  adicionarItensAgrupados() {
    //this.itensAgrupadosAdicionados = [];
    this.mensagemErro = '';
    this.mensagemAjuda = '';
    const de = this.itensAgrupadosDe?.trim();
    const ate = this.itensAgrupadosAte?.trim();

    if (!de || !ate) {
      this.mensagemErro = 'Preencha os campos "De" e "Até".';
      this.mensagemAjuda = 'Exemplo: De 1 até 10 ou De 1-A até 5-B.';
      return;
    }

    const regex = /^(\d+)([-]?[A-Za-zÀ-ÿ0-9]*)?$/;

    const deMatch = de.match(regex);
    const ateMatch = ate.match(regex);

    if (!deMatch || !ateMatch) {
      this.mensagemErro = 'Formato inválido.';
      this.mensagemAjuda = `Exemplos válidos:
      • De 1 até 15 → 1, 2, 3, ..., 15
      • De 1-A até 5-C → 1-A, 2-A...5-A, 1-B...5-C
      • De 1Santorine até 5Bethoven → 1Santorine...5Bethoven`;
      return;
    }

    const deNum = parseInt(deMatch[1], 10);
    const ateNum = parseInt(ateMatch[1], 10);
    const deSufixo = deMatch[2] || '';
    const ateSufixo = ateMatch[2] || '';

    // Apenas números → sequência direta
    if (!deSufixo && !ateSufixo) {
      for (let i = deNum; i <= ateNum; i++) {
        this.itensAgrupadosAdicionados.push(new ItensAgrupados({
          nome: i.toString(),
          estabelecimentoId: this.estabelecimentoCadastrado?.id,
          tipoEstabelecimentoId: this.estabelecimentoCadastrado?.tipoEstabelecimento?.id
        }));
      }
      return;
    }

    // Verifica hífen
    const usaHifen = deSufixo.startsWith('-') || ateSufixo.startsWith('-');
    const limpaDeSufixo = deSufixo.replace(/^-/, '');
    const limpaAteSufixo = ateSufixo.replace(/^-/, '');

    const sufixos = this.getTextRange(limpaDeSufixo, limpaAteSufixo);

    if (!sufixos.length) {
      this.mensagemErro = 'Não foi possível interpretar o intervalo informado.';
      this.mensagemAjuda = `Tente algo como:
      • De 1-A até 5-B
      • De 1Santorine até 3Bethoven`;
      return;
    }

    for (const sufixo of sufixos) {
      for (let i = deNum; i <= ateNum; i++) {
        const nome = usaHifen ? `${i}-${sufixo}` : `${i}${sufixo}`;
        this.itensAgrupadosAdicionados.push(new ItensAgrupados({
          nome: nome,
          estabelecimentoId: this.estabelecimentoCadastrado?.id,
          tipoEstabelecimentoId: this.estabelecimentoCadastrado?.tipoEstabelecimento?.id
        }));
      }
    }
  }

  /** Gera a lista de sufixos */
  private getTextRange(deText: string, ateText: string): string[] {
    if (!deText && !ateText) return [''];

    const letraRegex = /^[A-Za-z]$/;
    const results: string[] = [];

    if (letraRegex.test(deText) && letraRegex.test(ateText)) {
      const start = deText.charCodeAt(0);
      const end = ateText.charCodeAt(0);
      for (let c = start; c <= end; c++) {
        results.push(String.fromCharCode(c));
      }
    } else if (deText !== ateText) {
      results.push(deText, ateText);
    } else {
      results.push(deText);
    }

    return results;
  }

  adicionarAgrupador() {
    this.itensAgrupadosAdicionados.push(new ItensAgrupados({
      nome: this.umItemAgrupado.nome,
      estabelecimentoId: this.estabelecimentoCadastrado?.id,
      tipoEstabelecimentoId: this.estabelecimentoCadastrado?.tipoEstabelecimento?.id
    }));
  }

  confirmarCadastroItensAgrupados(){
    alert('confirmarCadastroItensAgrupados')
    this.loading.runWithLoading({
      itensAgrupadosCadastrados: this.itensAgrupadosService.criarLista(this.itensAgrupadosAdicionados)
    }).subscribe({
      next: resultado => {
        
        this.fechar.emit();

        console.log(resultado);

        this.router.navigate(['/vendas']);

      },
      error: err => {
        console.error('Erro no forkJoin:', err);
      }
    });

  }

}
