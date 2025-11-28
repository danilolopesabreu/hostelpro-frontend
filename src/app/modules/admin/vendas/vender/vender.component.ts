import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { OccupancyService } from './occupancy.service';
import { Occupancy, RoomStatus } from './occupancy.model';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GuestDetailsDialogComponent } from './guest-details-dialog/guest-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddGuestDetailsDialogComponent } from './add-guest-details-dialog/add-guest-details-dialog.component';
import { debounceTime, Subject } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProdutoService } from '@shared/components/produto/produto.service';
import { QuartoService } from '@shared/components/quarto/quarto.service';
import { Produto } from '@shared/components/produto/produto.model';
import { Quarto } from '@shared/components/quarto/quarto.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Pedido } from '@shared/components/pedido/pedido.model';
import { ItemPedido } from '@shared/components/pedido/itemPedido.model';
import { PedidoService } from '@shared/components/pedido/pedido.service';
import { ProdutoEstabelecimentoService } from '@shared/components/produto/produto-estabelecimento.service';
import { ProdutoEstabelecimento } from '@shared/components/produto/produto-estabelecimento.model';
import { LocalStorageService } from '@shared';
import { Usuario } from '../../usuario/usuario.model';
import { EstabelecimentoService } from '../../estabelecimento/estabelecimento.service';
import { Router } from '@angular/router';
import { Estabelecimento } from '../../estabelecimento/estabelecimento.model';
import { LoadingService } from '@shared/components/loading/loading.service';
import { Agrupador } from '@shared/modelos/agrupador.model';
import { ItensAgrupadosService } from '@shared/components/itens-agrupados/itens-agrupados.service';
import { ItensAgrupados } from '@shared/modelos/itens-agrupados.model';


@Component({
  selector: 'app-vender',
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
  templateUrl: './vender.component.html',
  styleUrl: './vender.component.scss',
})
export class VenderComponent {
  @ViewChild('painelResumoConfirmacaoPedido') painelResumoConfirmacaoPedido!: TemplateRef<any>;
  searchText = '';
  clienteNome = '';
  numeroQuarto: string | null = null;
  produtos: ProdutoEstabelecimento[] = [];
  produtosFiltrados: ProdutoEstabelecimento[] = [];
  quartos: Quarto[] = [];
  quartosFiltrados: Quarto[] = [];
  quartoSelecionado?: Quarto;
  buscaChanged = new Subject<string>();

  cartItems: ProdutoEstabelecimento[] = [];
  cartItemsConfirmado: ProdutoEstabelecimento[] = [];
  pedidoFinalizado: boolean = false;
  isLargeScreen = true;
  usuarioCadastrado?: Usuario;
  pedido?: Pedido;

  estabelecimentoCadastrado?: Estabelecimento;
  agrupador?: Agrupador;
  itensAgrupados: ItensAgrupados[] = [];
  itemAgrupadoSelecionado?: ItensAgrupados;
  itensAgrupadosFiltrados: ItensAgrupados[] = [];
  dummyItemAgrupado?: string | ItensAgrupados;
  numeroDoPedido?: string = '';

  tamanhoJanela:number = 0;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private produtoService: ProdutoService,
    private quartoService: QuartoService,
    private pedidoService: PedidoService,
    private estabelecimentoService: EstabelecimentoService,
    private produtoEstabelecimentoService: ProdutoEstabelecimentoService,
    private localStorageService: LocalStorageService,
    private loading: LoadingService,
    private itensAgrupadosService: ItensAgrupadosService) { }

  ngOnInit(): void {

    this.usuarioCadastrado = this.localStorageService.get("usuarioCadastrado");

    this.carregarDadosIniciais();
    this.checkScreenSize();
    this.buscaChanged.pipe(debounceTime(300)).subscribe(() => {
      this.filtrarProdutos();
    });
  }

  carregarDadosIniciais(): void {

    this.loading.runWithLoading({
      estabelecimento: this.estabelecimentoService.buscarPorId(this.usuarioCadastrado?.estabelecimentoId),
      produtos: this.produtoEstabelecimentoService.listarProdutosMaisVendidosPorEstabelecimento(this.usuarioCadastrado?.estabelecimentoId),
      itensAgrupados: this.itensAgrupadosService.listarPorEstabelecimento(this.usuarioCadastrado?.estabelecimentoId)
    }).subscribe({
      next: dados => {
        this.produtos = Array.isArray(dados.produtos) ? dados.produtos : []; this.produtosFiltrados = [...this.produtos];
        this.callBackCarregamentoEstabelecimento(dados.estabelecimento);
        this.itensAgrupados = dados.itensAgrupados;
      },
      error: err => {
        console.error('Erro ao carregar dados dados', err);
      }
    });

  }

  private callBackCarregamentoEstabelecimento(estabelecimento: Estabelecimento) {
    if(estabelecimento){
      if (!estabelecimento.itensAgrupados || estabelecimento.itensAgrupados?.length == 0) {
        this.router.navigate(['/estabelecimento/cadastro']);
      } else {
        this.estabelecimentoCadastrado = estabelecimento;
        this.agrupador = estabelecimento.tipoEstabelecimento?.agrupador;
      }
    }
  }

  filtrarProdutos() {
    const termo = this.removerAcentos(this.searchText.trim().toLowerCase());
    if (!termo) {
      this.produtosFiltrados = [...this.produtos];
    } else {
      this.produtosFiltrados = this.produtos.filter(p => {
        const nome = this.removerAcentos(p.nome.toLowerCase());
        const descricao = this.removerAcentos(p.descricao.toLowerCase());
        return nome.includes(termo) || descricao.includes(termo);
      });
    }
  }

  filtrarQuartos(valor: string): void {
    const filtro = valor?.toLowerCase() || '';
    this.quartosFiltrados = this.quartos.filter(q =>
      q.numero.toLowerCase().includes(filtro)
    );
  }

  filtrarItensAgrupados(valor: string | ItensAgrupados) {
    const filtro = typeof valor === 'string' ? valor.toLowerCase() : valor?.nome?.toLowerCase() ?? '';
    this.itensAgrupadosFiltrados = this.itensAgrupados.filter(
      item => item.nome.toLowerCase().includes(filtro)
    );
  }

  displayItemAgrupado(item?: ItensAgrupados): string {
    return item ? item.nome : '';
  }

  selecionarQuarto(numeroSelecionado: string): void {
    //this.numeroQuarto = numero;
    console.log(numeroSelecionado);
    this.quartoSelecionado = this.quartos.find(q => q.numero === numeroSelecionado);
    console.log('Quarto selecionado:', this.quartoSelecionado);
  }

  selecionarItemAgrupado(item: ItensAgrupados) {
    this.dummyItemAgrupado = item;
    console.log('Selecionado:', item);
  }

  // função utilitária para remover acentos e diacríticos
  removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  onInputChange() {
    this.buscaChanged.next(this.searchText);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => this.isLargeScreen = !result.matches);
  }

  checkScreenSize() {
    this.tamanhoJanela = window.innerWidth;
    this.isLargeScreen = window.innerWidth >= 1340; // breakpoint "lg" do Bootstrap
  }

  abrirDialogResumo(): void {
    this.dialog.open(this.painelResumoConfirmacaoPedido, {
      width: '95vw',
      maxWidth: '600px',
      panelClass: 'dialog-resumo-pedido',
      disableClose: true
    });
  } 

  validarItemAgrupado(): boolean {
    // Se o usuário digitou texto e não selecionou item
    if (typeof this.dummyItemAgrupado === 'string') {
      const valorDigitado = this.dummyItemAgrupado.toLowerCase();

      const encontrado = this.itensAgrupados.find(
        i => i.nome.toLowerCase() === valorDigitado
      );

      if (!encontrado) {
        console.warn('Valor digitado não encontrado, limpando campo...');
        this.dummyItemAgrupado = '';
        return false;
      } else {
        this.dummyItemAgrupado = encontrado;
        return true;
      }
    }
    return true;
  }

  finalizarPedido() {
    if (!this.clienteNome) {
      alert('Informe o nome do cliente!');
      return;
    }

    let nomeCampo: string = '';

    const tipo = this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome;
    switch (tipo) {
      case 'mesa':
        nomeCampo = 'Mesa';
        break;
      case 'quarto':
        nomeCampo = 'Quarto';
        break;
      case 'pedido':
        nomeCampo = 'Pedido';
        break;
      default:
        console.log('Tipo desconhecido');
    }


    if (this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome === 'quarto'
      && !this.validarItemAgrupado()
    ) {
      alert('Informe o Quarto!');
      return;
    }

    if (this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome === 'mesa'
      && !this.validarItemAgrupado()
    ) {
      alert('Informe a Mesa!');
      return;
    }

    if (this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome === 'pedido'
      && !this.itemAgrupadoSelecionado
    ) {
      alert('Informe o Pedido!');
      return;
    }

    let itensPedido = this.cartItems.map(produto =>
      new ItemPedido({
        produtoId: produto.id,
        quantidade: produto.quantidadeCarrinho,
        precoUnitario: produto.preco,
        precoTotal: (produto.preco) * (produto.quantidadeCarrinho),
        produtoEstabelecimento: produto
      })
    );

    this.pedido = new Pedido({
      estabelecimentoId: this.usuarioCadastrado?.estabelecimentoId,
      usuarioId: this.usuarioCadastrado?.id,
      nomeCliente: this.clienteNome,
      status: 'aberto',
      itens: itensPedido,
      numeroDoPedido: this.numeroDoPedido,
      itensAgrupados: this.dummyItemAgrupado as ItensAgrupados
    });

    /*this.pedidoService.criarPedido(this.pedido).subscribe({
      next: (dados) => { console.log(dados) },
      error: (err) => console.error('Erro ao criar pedido:', err)
    });*/

    this.loading.runWithLoading({
      pedido: this.pedidoService.criarPedido(this.pedido),
    }).subscribe({
      next: dados => {
        console.log(dados.pedido);
        this.pedidoFinalizado = true;
        this.itensAgrupadosFiltrados = this.itensAgrupados;

        let idsNoCarrinho = new Set(this.cartItems.map(item => item.id));

        this.produtosFiltrados.forEach(produto => {
          if (idsNoCarrinho.has(produto.id)) {
            produto.quantidadeCarrinho = 0;
          }
        });

        this.cartItemsConfirmado = structuredClone(this.cartItems);
        this.cartItems = [];

      },
      error: err => {
        console.error('Erro ao realizar pedido', err);
      }
    });

    // Aqui você poderia enviar os dados para o backend...
    //this.dummyItemAgrupado = '';
  }

  fecharPedido() {
    // Limpa carrinho e volta para modo vendas
    this.cartItems = [];
    this.cartItemsConfirmado = [];
    this.clienteNome = '';
    this.numeroQuarto = '';
    this.pedidoFinalizado = false;
    //this.itemAgrupadoSelecionado = undefined;
    this.dummyItemAgrupado = '';
    this.dialog.closeAll();
  }

  fecharModalResumo() {
    this.dialog.closeAll()
  }

  // Adiciona produto ao carrinho (ou incrementa quantidade se já existe)
  addToCart(produtoEstabelecimento: ProdutoEstabelecimento) {

    if(this.pedidoFinalizado){
      this.pedidoFinalizado = false;
      this.cartItemsConfirmado = [];
      this.clienteNome = '';
      this.dummyItemAgrupado = '';
    }

    // procura se o produto já existe no carrinho
    const existing = this.cartItems.find(item => item.id === produtoEstabelecimento.id);

    let filtrados = this.produtosFiltrados.find(item => item.id === produtoEstabelecimento.id);

    if (filtrados)
      filtrados.quantidadeCarrinho++;

    if (existing) {
      existing.quantidadeCarrinho++;
    } else {
      // importante: usar o mesmo objeto para que alterações reflitam no carrinho
      this.cartItems.push({ ...produtoEstabelecimento, quantidadeCarrinho: 1, _ref: produtoEstabelecimento });
    }

    //console.log(filtrados)
  }


  // Incrementa a quantidade do item
  incrementItem(item: ProdutoEstabelecimento) {
    item.quantidadeCarrinho++;

    let filtrados = this.produtosFiltrados.find(item2 => item2.id === item.id);

    if (filtrados)
      filtrados.quantidadeCarrinho++;
  }

  // Decrementa a quantidade do item (removendo se for 0)
  decrementItem(item: ProdutoEstabelecimento) {
    item.quantidadeCarrinho--;
    if (item.quantidadeCarrinho <= 0) {
      this.removeItem(item);
      return;
    }
    let filtrados = this.produtosFiltrados.find(item2 => item2.id === item.id);

    if (filtrados)
      filtrados.quantidadeCarrinho--;

    //console.log('filtrados:',filtrados)
  }

  // Remove item do carrinho
  removeItem(item: ProdutoEstabelecimento) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.fecharModalQtdItemProdutoZerado();

    let filtrados = this.produtosFiltrados.find(item2 => item2.id === item.id);

    if (filtrados)
      filtrados.quantidadeCarrinho = 0;
    
  }

  fecharModalQtdItemProdutoZerado() {
    if (this.cartItems.length == 0) {
      this.dialog.closeAll();
    }
  }

  // Calcula o total do pedido
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.preco * item.quantidadeCarrinho), 0);
  }

  getTotalConfirmado(): number {
    return this.cartItemsConfirmado.reduce((total, item) => total + (item.preco * item.quantidadeCarrinho), 0);
  }

  getTotalQuantidadeVendida(): number {
    return this.cartItems.reduce((total, item) => total + item.quantidadeCarrinho, 0);
  }
  editPrice(produtoEstabelecimento: ProdutoEstabelecimento, event: Event) {
    event.preventDefault(); // evita rolagem da página por causa do link
    produtoEstabelecimento.editando = true;
    produtoEstabelecimento.novoPreco = produtoEstabelecimento.preco;
  }

  confirmEdit(produtoEstabelecimento: ProdutoEstabelecimento) {
    if (produtoEstabelecimento.novoPreco !== undefined && produtoEstabelecimento.novoPreco > 0) {
      produtoEstabelecimento.preco = produtoEstabelecimento.novoPreco;

      // atualiza também no carrinho
      const cartItem = this.cartItems.find(item => item.id === produtoEstabelecimento.id);
      if (cartItem) {
        cartItem.preco = produtoEstabelecimento.novoPreco;
      }

      if (produtoEstabelecimento.id !== undefined) {
        this.produtoEstabelecimentoService.atualizar(produtoEstabelecimento).subscribe({
          next: (dados) => { console.log(dados) },
          error: (err) => console.error('Erro ao alterar o preco:', err)
        });
      }

    }
    produtoEstabelecimento.editando = false;
  }

  cancelEdit(produtoEstabelecimento: any) {
    produtoEstabelecimento.editando = false;
  }

  editarProduto(produto: any) {
    produto.editando = true;
    produto._backup = { ...produto }; // salva valores originais
  }

  confirmarEdicao(produto: any) {
    produto.editando = false;
    delete produto._backup;

  }

  cancelarEdicao(produto: any) {
    Object.assign(produto, produto._backup);
    produto.editando = false;
    delete produto._backup;
  }

}
