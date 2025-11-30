import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '@core/models/interface';
import { AuthServiceLocal, TokenService } from '@core';
import { Estabelecimento } from '../../estabelecimento.model';
import { TipoEstabelecimento } from '../../tipo-estabelecimento.model';
import { CategoriaProduto } from '@shared/components/categoria-produto/categoria-produto.model';
import { Usuario } from 'app/modules/admin/usuario/usuario.model';
import { Auth0User } from '@core/models/user.auth0.model';
import { PAPEL_ADMINISTRADOR } from '@shared/modelos/papel-permissao';
import { AuthService, User as UserAuth0 } from '@auth0/auth0-angular';
import { CategoriaProdutoService } from '@shared/components/categoria-produto/categoria-produto.service';
import { EstabelecimentoService } from '../../estabelecimento.service';
import { TipoEstabelecimentoService } from '../../tipo-estabelecimento.service';
import { LoadingService } from '@shared/components/loading/loading.service';
import { ItensAgrupados } from '@shared/modelos/itens-agrupados.model';
import { ItensAgrupadosService } from '@shared/components/itens-agrupados/itens-agrupados.service';
import { LocalStorageService } from '@shared';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-modal-cadastro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatAutocompleteModule
  ],
  templateUrl: './modal-cadastro.component.html',
  styleUrls: ['./modal-cadastro.component.scss'],
})
export class ModalCadastroComponent {

  // ---------------------------
  // Outputs
  // ---------------------------
  @Output() fechar = new EventEmitter<void>();

  // ---------------------------
  // Inputs / Form
  // ---------------------------
  estabelecimentoNome: string = '';
  tipoSelecionado?: TipoEstabelecimento = undefined;
  categoriasSelecionadas: CategoriaProduto[] = [];

  itensAgrupadosDe: string = '';
  itensAgrupadosAte: string = '';
  umItemAgrupado: ItensAgrupados = new ItensAgrupados();
  itensAgrupadosAdicionados: ItensAgrupados[] = [];

  mensagemErro: string = '';
  mensagemAjuda: string = '';

  // ---------------------------
  // Flags de tela
  // ---------------------------
  mostrarTelaNovoEstabelecimento: boolean = true;
  mostrarTelaItensAgrupados: boolean = false;

  // ---------------------------
  // Dados carregados
  // ---------------------------
  categorias: CategoriaProduto[] = [];
  tiposEstabelecimento: TipoEstabelecimento[] = [];
  estabelecimentoCadastrado?: Estabelecimento;

  @Input() overlayRef!: OverlayRef;

  // ---------------------------
  // Auth / Serviços
  // ---------------------------
  private auth = inject(AuthService);
  private user: Auth0User = new Auth0User();

  constructor(
    private router: Router,
    private categoriaProdutoService: CategoriaProdutoService,
    private estabelecimentoService: EstabelecimentoService,
    private tipoEstabelecimentoService: TipoEstabelecimentoService,
    private loading: LoadingService,
    private itensAgrupadosService: ItensAgrupadosService,
    private store: LocalStorageService,
    private localAuthService: AuthServiceLocal,
    private cdr: ChangeDetectorRef
  ) {}

  // ---------------------------
  // Lifecycle
  // ---------------------------
  ngOnInit(): void {
    this.verificarElementosLocalStorage();
    
  }

  // ---------------------------
  // Métodos de inicialização
  // ---------------------------
  private carregarDadosIniciais(): void {
    this.loading.runWithLoading({
      //user: this.auth.user$.pipe(take(1)),
      categorias: this.categoriaProdutoService.listarCategoriasPrincipais(1),
      tipos: this.tipoEstabelecimentoService.listar()
    }).subscribe({
      next: resultado => {
        //this.user = resultado.user;
        this.categorias = resultado.categorias;
        this.tiposEstabelecimento = resultado.tipos;
      },
      error: err => {
        console.error('Erro ao carregar dados iniciais', err);
      }
    });
  }

  private verificarElementosLocalStorage(){
    //let usuario:Usuario = this.store.get("usuarioCadastrado");
    this.user = this.store.get("usuarioLogado");
    let estabelecimento:Estabelecimento = this.store.get("estabelecimentoCadastrado");
    if(estabelecimento.id !== undefined){
      this.estabelecimentoCadastrado = estabelecimento;
      this.mostrarTelaNovoEstabelecimento = false;
      this.mostrarTelaItensAgrupados = true;
    } else {
      this.carregarDadosIniciais();
    }
  }

  // ---------------------------
  // Seleção de Tipo e Categoria
  // ---------------------------
  selecionarTipo(tipo: TipoEstabelecimento): void {
    this.tipoSelecionado = this.tipoSelecionado === tipo ? undefined : tipo;
  }

  toggleCategoria(categoria: CategoriaProduto): void {
    const index = this.categoriasSelecionadas.findIndex(c => c.id === categoria.id);
    if (index >= 0) this.categoriasSelecionadas.splice(index, 1);
    else this.categoriasSelecionadas.push(categoria);
  }

  isCategoriaSelecionada(categoria: CategoriaProduto): boolean {
    return this.categoriasSelecionadas.some(c => c.id === categoria.id);
  }

  // ---------------------------
  // Validações
  // ---------------------------
  isFormularioValido(): boolean {
    return (
      this.estabelecimentoNome.trim().length > 0 &&
      !!this.tipoSelecionado &&
      this.categoriasSelecionadas.length > 0
    );
  }

  isFormularioItensAgrupadoValido(): boolean {
    return this.itensAgrupadosAdicionados.length > 0;
  }

  // ---------------------------
  // Eventos UI
  // ---------------------------
  onFechar(): void {
    console.log('Categorias selecionadas:', this.categoriasSelecionadas);
    this.fechar.emit();
  }

  onBackgroundClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay-background')) {
      event.stopPropagation();
      console.log('Clique na área de fundo ignorado.');
    }
  }

  // ---------------------------
  // Cadastro de Estabelecimento
  // ---------------------------
  confirmarCadastro(): void {
    if (!this.isFormularioValido()) return;

    const usuario = new Usuario({
      nome: this.user?.name,
      email: this.user?.email,
      papel: PAPEL_ADMINISTRADOR,
      ativo: true,
      foto: this.user?.picture
    });

    const novoEstabelecimento = new Estabelecimento({
      nome: this.estabelecimentoNome,
      email: this.user?.email,
      tipoEstabelecimento: this.tipoSelecionado,
      usuarios: [usuario],
      categoriaProduto: this.categoriasSelecionadas
    });

    this.loading.runWithLoading({
      estabelecimento: this.estabelecimentoService.criar(novoEstabelecimento)
    }).subscribe({
      next: resultado => {
        this.estabelecimentoCadastrado = resultado.estabelecimento;

        this.store.set("usuarioCadastrado", resultado.estabelecimento.usuarios[0]);
        this.store.set('currentUser', this.getUserFromUserAuthAndUserCadastrado(this.user, resultado.estabelecimento.usuarios[0]));
        this.localAuthService.assignUser(new BehaviorSubject<User>(this.store.get('currentUser')));
        this.localAuthService.menu();
        this.store.set("estabelecimentoCadastrado", resultado.estabelecimento);

        console.log("this.store.get", this.store.get("usuarioCadastrado"))
        console.log('agrupador.nome === pedido', this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome === 'pedido', this.estabelecimentoCadastrado)
        if (this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome === 'pedido') {
          this.fechar.emit();
          this.overlayRef.dispose();
          this.router.navigate(['/vendas']);
          
        } else {
          this.mostrarTelaNovoEstabelecimento = false;
          this.mostrarTelaItensAgrupados = true;
        }
      },
      error: err => console.error('Erro ao criar estabelecimento', err)
    });
  }

  private getUserFromUserAuthAndUserCadastrado(user:UserAuth0, usuario:Usuario): User {
      return {
        id: usuario.id,
        //username: "admin",
        //password: "admin",
        name: user.given_name,
        email: user.email,
        role: [
          { 
            name: usuario.papel?.nome,
            priority: 1
          }
        ],
        permissions: usuario.papel?.permissoes.map(p => p.nome),
        avatar: user.picture
      };
    }

  // ---------------------------
  // Itens Agrupados
  // ---------------------------
  adicionarAgrupador(): void {
    if (!this.umItemAgrupado.nome) return;
    this.itensAgrupadosAdicionados.push(new ItensAgrupados({
      nome: this.umItemAgrupado.nome,
      estabelecimentoId: this.estabelecimentoCadastrado?.id,
      tipoEstabelecimentoId: this.estabelecimentoCadastrado?.tipoEstabelecimento?.id
    }));
    this.umItemAgrupado = new ItensAgrupados();
  }

  removerItem(index: number): void {
    this.itensAgrupadosAdicionados.splice(index, 1);
  }

  removerTodos(): void {
    this.itensAgrupadosAdicionados = [];
  }

  adicionarItensAgrupados(): void {
    this.mensagemErro = '';
    this.mensagemAjuda = '';

    if (!this.itensAgrupadosDe?.trim() || !this.itensAgrupadosAte?.trim()) {
      this.mensagemErro = 'Preencha os campos "De" e "Até".';
      this.mensagemAjuda = 'Exemplo: De 1 até 10 ou De 1-A até 5-B.';
      return;
    }

    const regex = /^(\d+)([-]?[A-Za-zÀ-ÿ0-9]*)?$/;
    const deMatch = this.itensAgrupadosDe.match(regex);
    const ateMatch = this.itensAgrupadosAte.match(regex);

    if (!deMatch || !ateMatch) {
      this.mensagemErro = 'Formato inválido.';
      this.mensagemAjuda = `Exemplos válidos:
      • De 1 até 15 → 1, 2, 3, ..., 15
      • De 1-A até 5-B → 1-A, 2-A...5-A, 1-B...5-B
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

    // Sufixos com hífen ou texto
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
          nome,
          estabelecimentoId: this.estabelecimentoCadastrado?.id,
          tipoEstabelecimentoId: this.estabelecimentoCadastrado?.tipoEstabelecimento?.id
        }));
      }
    }
  }

  private getTextRange(deText: string, ateText: string): string[] {
    if (!deText && !ateText) return [''];
    const letraRegex = /^[A-Za-z]$/;
    const results: string[] = [];

    if (letraRegex.test(deText) && letraRegex.test(ateText)) {
      const start = deText.charCodeAt(0);
      const end = ateText.charCodeAt(0);
      for (let c = start; c <= end; c++) results.push(String.fromCharCode(c));
    } else if (deText !== ateText) {
      results.push(deText, ateText);
    } else {
      results.push(deText);
    }

    return results;
  }

  confirmarCadastroItensAgrupados(): void {
    if (!this.isFormularioItensAgrupadoValido()) return;

    this.loading.runWithLoading({
      itensAgrupadosCadastrados: this.itensAgrupadosService.criarLista(this.itensAgrupadosAdicionados)
    }).subscribe({
      next: resultado => {
        console.log('Itens agrupados cadastrados:', resultado);
        this.fechar.emit();
        this.router.navigate(['/vendas']);
      },
      error: err => console.error('Erro ao cadastrar itens agrupados:', err)
    });
  }

}