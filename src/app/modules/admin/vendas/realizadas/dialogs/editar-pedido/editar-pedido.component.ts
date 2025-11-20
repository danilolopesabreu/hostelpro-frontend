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

export interface DialogData {
  id: number;
  action: string;
  pedido: Pedido;
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
    DecimalPipe,
    MatListItem,
    MatList,
    FormsModule,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatCardHeader,
    MatCard, PageHeaderComponent, MatCardModule, MatTableModule
  ],
  templateUrl: './editar-pedido.component.html',
  styleUrl: './editar-pedido.component.scss',
})
export class EditarPedidoComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'weight', 'symbol', 'valorTotal'];
  dialogTitle: string = '';

  todosSelecionados: boolean = false;
  indeterminado = false;

  pedido!: Pedido;
  dataSource: ItemPedido[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.dialogTitle = 'Pedido #' + this.data.pedido.id;
    this.pedido = this.data.pedido;
    this.dataSource = this.data.pedido.itens;

    // marca todos os itens ao carregar a tela
    this.pedido.itens?.forEach(i => i.selecionado = true);
    this.verificarSelecao();
    console.log(this.pedido)
  }

  toggleSelecionarTodos() {
    this.todosSelecionados = !this.todosSelecionados;
    this.indeterminado = false;

    this.pedido.itens?.forEach(item => {
      item.selecionado = this.todosSelecionados;
    });
  }

  verificarSelecao() {
    const itens = this.pedido.itens ?? [];

    const qtdSelecionados = itens.filter(i => i.selecionado).length;

    this.todosSelecionados = qtdSelecionados === itens.length;
    this.indeterminado =
      qtdSelecionados > 0 && qtdSelecionados < itens.length;
  }

  calcularTotalPedido(): number {
    return (this.pedido.itens ?? [])
      .filter(i => i.selecionado)
      .reduce((sum, item) => sum + (item.precoTotal ?? 0), 0);
  }

  // Calcula o total do pedido considerando apenas os itens selecionados
  calcularTotal() {
    return this.pedido.itens
      ?.reduce((t, i) => t + (i.precoTotal ?? 0), 0) ?? 0;
  }

  submit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
