import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Pedido } from '@shared/components/pedido/pedido.model';
import localePt from '@angular/common/locales/pt';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { MatTableModule } from '@angular/material/table';
import { ProdutoEstabelecimento } from '@shared/components/produto/produto-estabelecimento.model';
import { ItemPedido } from '@shared/components/pedido/itemPedido.model';
import { PedidoService } from '@shared/components/pedido/pedido.service';
import { LoadingService } from '@shared/components/loading/loading.service';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { WhatsappButtonComponent } from '@shared/components/whatsapp-button/whatsapp-button.component';
import { Usuario } from 'app/modules/admin/usuario/usuario.model';
import { LocalStorageService } from '@shared';
import { Estabelecimento } from 'app/modules/admin/estabelecimento/estabelecimento.model';

export interface DialogData {
  id: number;
  action: string;
  pedido: Pedido;
  usuarioCadastrado: Usuario;
}

@Component({
  selector: 'app-editar-pedido',
  providers: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatCheckboxModule,
    FormsModule,
    MatCardContent,
    MatCardTitle,
    MatCard, MatCardModule, MatTableModule, FeatherIconsComponent,WhatsappButtonComponent
  ],
  templateUrl: './editar-pedido.component.html',
  styleUrl: './editar-pedido.component.scss',
})
export class EditarPedidoComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'weight', 'symbol', 'valorTotal', 'action'];
  dialogTitle: string = '';

  todosSelecionados: boolean = false;
  indeterminado = false;

  pedido!: Pedido;
  dataSource: ItemPedido[] = [];

  ocultarBotoes:boolean = false;

  totalPedidoPago:number = 0;
  totalPedidoAPagar:number = 0;

  mensagemWhatsapp:string = '';

  estabelecimentoCadastrado?: Estabelecimento;

  constructor(
    public dialogRef: MatDialogRef<EditarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private pedidoService:PedidoService,
    private loading: LoadingService,
    private localStorageService: LocalStorageService) {
  }
 
  updateDisplayedColumns() {
    if (this.ocultarBotoes) {
      this.displayedColumns = [
        'name',
        'weight',
        'symbol',
        'valorTotal'
      ];
    } else {
      this.displayedColumns = [
        'select',
        'name',
        'weight',
        'symbol',
        'valorTotal',
        'action'
      ];
    }
  }

  obterIdentificadorItemAgrupado(){
   return  this.pedido.tipoEstabelecimento?.agrupador?.rotulo;
  }

  obterValorItemAgrupado(){
   return  this.pedido.itensAgrupados != undefined ? 
      this.pedido.itensAgrupados.nome :
      this.pedido.numeroDoPedido;
  }

  definirEstadoAcoes() {
    let statusPedido = this.pedido.status;
    if(statusPedido === 'fechado' || statusPedido === 'cancelado')
      this.ocultarBotoes = true;
  }

  ngOnInit(): void {
    this.dialogTitle = 'Código do Pedido #' + this.data.pedido.id;
    this.pedido = this.data.pedido;

    this.estabelecimentoCadastrado = this.localStorageService.get("estabelecimento");

    this.data.pedido.itens.sort((a, b) =>
      a.produtoEstabelecimento.nome.localeCompare(b.produtoEstabelecimento.nome)
    );

    this.dataSource = this.data.pedido.itens;

    // marca todos os itens ao carregar a tela
    this.pedido.itens?.forEach(i => i.selecionado = true);
    this.verificarSelecao();
    console.log(this.pedido)
    this.definirEstadoAcoes()
    this.updateDisplayedColumns();

    this.totalPedidoAPagar = this.calcularTotalAPagar();
    this.totalPedidoPago = this.calcularTotalPago();

    this.montarMensagemWhatsapp();
  }

  toggleSelecionarTodos() {
    this.todosSelecionados = !this.todosSelecionados;
    this.indeterminado = false;

    this.pedido.itens?.forEach(item => {
      item.selecionado = this.todosSelecionados;
    });

    this.totalPedidoAPagar = this.calcularTotalAPagar();
  }

  verificarSelecao() {
    const itens = this.pedido.itens ?? [];

    const qtdSelecionados = itens.filter(i => i.selecionado).length;

    this.todosSelecionados = qtdSelecionados === itens.length;
    this.indeterminado =
      qtdSelecionados > 0 && qtdSelecionados < itens.length;

    this.totalPedidoAPagar = this.calcularTotalAPagar();
  }

  isTodosSelecionados(): boolean{
    this.verificarSelecao();
    return this.todosSelecionados;
  }

  isAlgumSelecionados(): boolean{
    const itens = this.pedido.itens ?? [];
    return itens.filter(i => i.selecionado).length > 0;
  }

  calcularTotalPedido(): number {
    return (this.pedido.itens ?? [])
      ?.filter(i => i.status !== 'cancelado' && i.status !== 'fechado')
      .reduce((sum, item) => sum + (item.precoTotal ?? 0), 0);
  }

  // Calcula o total do pedido considerando apenas os itens selecionados
  calcularTotal() {
    return this.pedido.itens
      ?.filter(i => i.status !== 'cancelado' && i.status !== 'fechado')
      .reduce((t, i) => t + (i.precoTotal ?? 0), 0) ?? 0;
  }

  calcularTotalAPagar() {
    return this.pedido.itens
      ?.filter(i => (i.status === 'aberto' || i.status === 'pendente') && i.selecionado)
      .reduce((t, i) => t + (i.precoTotal ?? 0), 0) ?? 0;
  }

  calcularTotalPago() {
    return this.pedido.itens
      ?.filter(i => i.status === 'fechado')
      .reduce((t, i) => t + (i.precoTotal ?? 0), 0) ?? 0;
  }

  cancelarPedido(){
    this.pedido.status = 'cancelado';
    this.pedido.itens.forEach(item =>{
      item.status = 'cancelado';
    });

    this.loading.runWithLoading({
      pedido: this.pedidoService.atualizarPedido(this.pedido),
    }).subscribe({
      next: dados => {
        console.log(dados.pedido);
        this.callBackCancelarPedido()      
      }
    });

  }

  deletarPedido(){
    this.loading.runWithLoading({
      pedido: this.pedidoService.excluirPedido(this.pedido.id),
    }).subscribe({
      next: dados => {
        console.log(dados.pedido);
        this.pedido.status = 'deletado';
        this.onNoClick();
      }
    });

  }

  callBackCancelarPedido(){
    this.definirEstadoAcoes();
    this.updateDisplayedColumns();
  }

  confirmarPagamento() {

    let statusPedido = this.isTodosSelecionados() ? 'fechado' : 'pendente';

    let itensPedido = this.pedido.itens ?? [];
    /*let itensPedidoSelecionados = itensPedido.filter(i => i.selecionado);
    
    itensPedidoSelecionados.forEach(item => {
      item.status = 'fechado';
    });*/

    itensPedido.forEach(i => {
      if(i.status !== 'fechado' && i.status !== 'cancelado')
        i.status = i.selecionado ? 'fechado' : 'pendente';
    });

    this.pedido.status = statusPedido;
    //this.pedido.itens = itensPedidoSelecionados;
    console.log(this.pedido)
    this.loading.runWithLoading({
      pedido: this.pedidoService.atualizarPedido(this.pedido),
    }).subscribe({
      next: dados => {
        console.log(dados.pedido);
        this.callBackConfirmarPagamento()    
        this.totalPedidoPago = this.calcularTotalPago();  
        this.totalPedidoAPagar = this.calcularTotalAPagar();
      }
    });
        
  }

  callBackConfirmarPagamento(){
    this.definirEstadoAcoes();
    this.updateDisplayedColumns();
  }

  deleteItem(item: ItemPedido) {
    console.log("Removendo item:", item);

    if(this.pedido.status === 'aberto' && this.pedido.itens.length == 1){
      this.deletarPedido();
      return;
    }

    //this.removerItemPedidoDeletadoLista(item);

    this.loading.runWithLoading({
      pedido: this.pedidoService.excluirItemPedido(item.id),
    }).subscribe({
      next: dados => {
        console.log(dados.pedido);
        this.removerItemPedidoDeletadoLista(item);  
        this.montarMensagemWhatsapp();
      }
    });

  }

  removerItemPedidoDeletadoLista(item: ItemPedido){
    if (!this.pedido || !this.pedido.itens) return;
  
    // Remove o item da lista
    this.pedido.itens = this.pedido.itens.filter(i => i.id !== item.id);
  
    // (Opcional, mas muito recomendado)
    // Forçar o Material Table a atualizar
    this.pedido.itens = [...this.pedido.itens];
  }

  callBackDeleteItem(item: ItemPedido){
  }

  onNoClick(): void {
    this.dialogRef.close(this.pedido);
  }

  montarMensagemWhatsapp(){

    let nomeEstabelecimento = "*"+this.estabelecimentoCadastrado?.nome+"*\n";
    let pedidoRealizado = "*Informações do Pedido Realizado*\n";
    let dataHora = "Data: "+this.formatarDataHora(this.pedido.dataCriacao as Date)+"\n";
    let nomeCliente = "Cliente: *"+this.pedido.nomeCliente+"*\n";
    let agrupador = this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.rotulo+": ";
    
    if(this.estabelecimentoCadastrado?.tipoEstabelecimento?.agrupador?.nome === 'pedido'){
      agrupador += "*"+this.pedido.numeroDoPedido+"*\n";
    } else {
      agrupador += "*"+this.obterIdentificadorItemAgrupado()+"*\n";
    }

    let totalPedido = "Total: *"+this.formatarValorMonetario(this.calcularTotalPedido())+"*\n";

    let itensCarrinhoMensagem = "*Itens:*\n";

    this.pedido.itens.forEach(item => {
      itensCarrinhoMensagem += item.produtoEstabelecimento.nome+" x("+item.quantidade+") "+this.formatarValorMonetario(item.precoUnitario * item.quantidade)+"\n";
    });

    this.mensagemWhatsapp = nomeEstabelecimento+pedidoRealizado+dataHora+nomeCliente+agrupador+totalPedido+itensCarrinhoMensagem;

  }

  formatarValorMonetario(valor:number):string{
    let valorFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);

    return valorFormatado;
  }

  formatarDataHora(
    data: Date | string | number,
    locale: string = 'pt-BR'
  ): string {
    if (!data) return '';

    const date = new Date(data);

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

}
