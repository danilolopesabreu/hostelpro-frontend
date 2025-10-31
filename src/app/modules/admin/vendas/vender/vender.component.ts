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
import { Produto } from '@shared/components/produto/produto.model';

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
  ],
  templateUrl: './vender.component.html',
  styleUrl: './vender.component.scss',
})
export class VenderComponent {
  @ViewChild('painelResumoConfirmacaoPedido') painelResumoConfirmacaoPedido!: TemplateRef<any>;
  searchText = '';
  clienteNome = '';
  numeroQuarto: string | null = null;
  produtos: Produto[] = [];
  products = [
    { id: 1, name: 'Água Mineral 500ml', price: 3.9, description: 'Água leve e pura', image: 'assets/images/avatars/agua-mineral.jpg', newPrice: 0, editing: false },
    { id: 2, name: 'Coca-Cola Lata Descr Muito Longa', price: 5.5, description: '350ml gelada', image: 'assets/images/avatars/coca.jpg', newPrice: 0, editing: false },
    { id: 3, name: 'Água Mineral 1L', price: 7.9, description: 'Água leve e pura', image: 'assets/images/avatars/agua-mineral.jpg', newPrice: 0, editing: false },
    { id: 4, name: 'Coca-Cola Lata 200ml', price: 5.5, description: '350ml gelada', image: 'assets/images/avatars/coca.jpg', newPrice: 0, editing: false },
    { id: 5, name: 'Coca-Cola Lata 350ml', price: 5.5, description: '350ml gelada', image: 'assets/images/avatars/coca.jpg', newPrice: 0, editing: false },
    // outros produtos...
  ];

  cartItems: any[] = [];
  cartItemsConfirmado: any[] = [];
  pedidoFinalizado: boolean = false;
  isLargeScreen = true;

  constructor(
    private dialog: MatDialog, 
    private breakpointObserver: BreakpointObserver,
    private produtoService: ProdutoService) { 

  }


  ngOnInit(): void {
    this.checkScreenSize();
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarProdutosPorEstabelecimento(1).subscribe({
      next: (dados) => {this.produtos = dados; console.log(dados)},
      error: (err) => console.error('Erro ao buscar produtos:', err)
    });
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

    // Aqui você poderia enviar os dados para o backend...
    this.pedidoFinalizado = true;
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
  addToCart(product: any) {
    // procura se o produto já existe no carrinho
    const existing = this.cartItems.find(item => item.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      // importante: usar o mesmo objeto para que alterações reflitam no carrinho
      this.cartItems.push({ ...product, quantity: 1, _ref: product });
    }
  }


  // Incrementa a quantidade do item
  incrementItem(item: any) {
    item.quantity++;
  }

  // Decrementa a quantidade do item (removendo se for 0)
  decrementItem(item: any) {
    item.quantity--;
    if (item.quantity <= 0) {
      this.removeItem(item);
    }
  }

  // Remove item do carrinho
  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(i => i.nome !== item.nome);
    this.fecharModalQtdItemProdutoZerado();
  }

  fecharModalQtdItemProdutoZerado() {
    if (this.cartItems.length == 0) {
      this.dialog.closeAll();
    }
  }

  // Calcula o total do pedido
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.preco * item.quantity), 0);
  }

  getTotalConfirmado(): number {
    return this.cartItemsConfirmado.reduce((total, item) => total + (item.preco * item.quantity), 0);
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  editPrice(product: any, event: Event) {
    event.preventDefault(); // evita rolagem da página por causa do link
    product.editando = true;
    product.novoPreco = product.preco;
  }

  confirmEdit(product: any) {
    if (product.novoPreco > 0) {
      product.preco = product.novoPreco;

      // atualiza também no carrinho
      const cartItem = this.cartItems.find(item => item.id === product.id);
      if (cartItem) {
        cartItem.preco = product.novoPreco;
      }
    }
    product.editando = false;
  }

  cancelEdit(product: any) {
    product.editando = false;
  }

}
