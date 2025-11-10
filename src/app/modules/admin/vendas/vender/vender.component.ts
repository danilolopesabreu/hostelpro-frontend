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

  pedido?: Pedido;

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private produtoService: ProdutoService,
    private quartoService: QuartoService,
    private pedidoService:PedidoService,
    private produtoEstabelecimentoService:ProdutoEstabelecimentoService ) {  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.carregarProdutos();
    //this.carregarQuartos();
    this.buscaChanged.pipe(debounceTime(300)).subscribe(() => {
      this.filtrarProdutos();
    });
  }

  carregarProdutos(): void {
    
    /*this.produtoService.listarProdutosPorEstabelecimento(1).subscribe({
      next: (dados) => { this.produtos = dados; this.produtosFiltrados = [...this.produtos]; },
      error: (err) => console.error('Erro ao buscar produtos:', err)
    });*/

    this.produtoEstabelecimentoService.listarPorEstabelecimento(4).subscribe({
      next: (dados) => { this.produtos = dados; this.produtosFiltrados = [...this.produtos]; },
      error: (err) => console.error('Erro ao buscar produtos:', err)
    });

  }

  /*carregarQuartos(): void {
    this.quartoService.listarPorEstabelecimento(1).subscribe({
      next: (dados) => { this.quartos = dados; this.quartosFiltrados = dados; },
      error: (err) => console.error('Erro ao buscar quartos:', err)
    });
  }*/

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

  selecionarQuarto(numeroSelecionado: string): void {
    //this.numeroQuarto = numero;
    console.log(numeroSelecionado);
    this.quartoSelecionado = this.quartos.find(q => q.numero === numeroSelecionado);
    console.log('Quarto selecionado:', this.quartoSelecionado);
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

  abrirDialogResumo(): void {
    this.dialog.open(this.painelResumoConfirmacaoPedido, {
      width: '95vw',
      maxWidth: '600px',
      panelClass: 'dialog-resumo-pedido',
      disableClose: true
    });
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992; // breakpoint "lg" do Bootstrap
  }

  finalizarPedido() {
    if (!this.clienteNome || !this.numeroQuarto) {
      alert('Informe o nome do cliente e número do quarto!');
      return;
    }

    if(!this.quartoSelecionado){
      alert('Selecione um quarto!');
      return;
    }

    if(this.numeroQuarto !== this.quartoSelecionado.numero){
      this.quartoSelecionado = this.quartos.find(q => q.numero === this.numeroQuarto);
      if(!this.quartoSelecionado){
        alert('Numero do quarto informado não existe!');
        return;
      }
    }

    let itensPedido = this.cartItems.map(produto =>
      new ItemPedido({
        produtoId: produto.id,
        quantidade: produto.quantidadeVendida,
        precoUnitario: produto.preco,
        precoTotal: (produto.preco) * (produto.quantidadeVendida),
        produtoEstabelecimento: produto
      })
    );

    this.pedido = new Pedido({
      estabelecimentoId: 1,
      usuarioId: 3,
      quartoId: this.quartoSelecionado.id,
      nomeCliente: this.clienteNome,
      status: 'aberto',
      itens: itensPedido
    });

    this.pedidoService.criarPedido(this.pedido).subscribe({
      next: (dados) => { console.log(dados) },
      error: (err) => console.error('Erro ao criar pedido:', err)
    });

    // Aqui você poderia enviar os dados para o backend...
    this.pedidoFinalizado = true;
    this.quartosFiltrados = this.quartos;
  }

  fecharPedido() {
    // Limpa carrinho e volta para modo vendas
    this.cartItems = [];
    this.clienteNome = '';
    this.numeroQuarto = '';
    this.pedidoFinalizado = false;
    this.dialog.closeAll();
  }

  fecharModalResumo() {
    this.dialog.closeAll()
  }

  // Adiciona produto ao carrinho (ou incrementa quantidade se já existe)
  addToCart(produtoEstabelecimento: ProdutoEstabelecimento) {
    // procura se o produto já existe no carrinho
    const existing = this.cartItems.find(item => item.id === produtoEstabelecimento.id);

    if (existing) {
      existing.quantidadeVendida++;
    } else {
      // importante: usar o mesmo objeto para que alterações reflitam no carrinho
      this.cartItems.push({ ...produtoEstabelecimento, quantidadeVendida: 1, _ref: produtoEstabelecimento });
    }
  }


  // Incrementa a quantidade do item
  incrementItem(item: ProdutoEstabelecimento) {
    item.quantidadeVendida++;
  }

  // Decrementa a quantidade do item (removendo se for 0)
  decrementItem(item: ProdutoEstabelecimento) {
    item.quantidadeVendida--;
    if (item.quantidadeVendida <= 0) {
      this.removeItem(item);
    }
  }

  // Remove item do carrinho
  removeItem(item: ProdutoEstabelecimento) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.fecharModalQtdItemProdutoZerado();
  }

  fecharModalQtdItemProdutoZerado() {
    if (this.cartItems.length == 0) {
      this.dialog.closeAll();
    }
  }

  // Calcula o total do pedido
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.preco * item.quantidadeVendida), 0);
  }

  getTotalConfirmado(): number {
    return this.cartItemsConfirmado.reduce((total, item) => total + (item.preco * item.quantidadeVendida), 0);
  }

  getTotalQuantidadeVendida(): number {
    return this.cartItems.reduce((total, item) => total + item.quantidadeVendida, 0);
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
        this.produtoEstabelecimentoService.atualizar(produtoEstabelecimento.id, produtoEstabelecimento).subscribe({
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

}
