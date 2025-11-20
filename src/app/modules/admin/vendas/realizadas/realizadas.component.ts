import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
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
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AllRoomService } from './all-rooms.service';
import { AllRooms } from './all-rooms.model';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { LocalStorageService, TableExportUtil } from '@shared';
import { rowsAnimation } from '@shared';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';
import { PedidoService } from '@shared/components/pedido/pedido.service';
import { Usuario } from '../../usuario/usuario.model';
import { LoadingService } from '@shared/components/loading/loading.service';
import { Pedido } from '@shared/components/pedido/pedido.model';
import { ItensAgrupados } from '@shared/modelos/itens-agrupados.model';
import { EditarPedidoComponent } from './dialogs/editar-pedido/editar-pedido.component';

@Component({
  selector: 'app-realizadas',
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
    NgClass,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './realizadas.component.html',
  styleUrl: './realizadas.component.scss',
})
export class RealizadasComponent implements OnInit, OnDestroy{
  columnDefinitions = [
    { def: 'itensAgrupados.nome', label: 'Quarto', type: 'text', visible: true },
    { def: 'nomeCliente', label: 'Nome Cliente', type: 'text', visible: true },
    { def: 'dataCriacao', label: 'Data Pedido', type: 'date', visible: true },
    { def: 'calcularTotalPedido', label: 'Total Pedido', type: 'currency', visible: true },
    { def: 'status', label: 'Situação', type: 'status', visible: true },
    { def: 'actions', label: 'Ações', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Pedido>([]);
  selection = new SelectionModel<AllRooms>(true, []);
  private destroy$ = new Subject<void>();
  isLoading = true;
  contextMenuPosition = { x: '0px', y: '0px' };
  usuarioCadastrado?: Usuario;
  pedidos:Pedido[] = [];
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private dialog: MatDialog,
    private allRoomService: AllRoomService,
    private snackBar: MatSnackBar,
    private pedidoService: PedidoService,
    private localStorageService: LocalStorageService,
    private loading: LoadingService,
  ) {}

  ngOnInit() {
    this.usuarioCadastrado = this.localStorageService.get("usuarioCadastrado");
    
    this.displayedColumns = this.columnDefinitions
      .filter(c => c.visible)
      .map(c => c.def);

    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

    /** Resolve valores simples, aninhados e funções */
  getColumnValue(row: any, column: string): any {

    // Suporte a "cliente.nome", "itensAgrupados.nome"
    if (column.includes('.')) {
      return column.split('.').reduce((obj, key) => obj?.[key], row);
    }

    // Suporte a métodos do model como "calcularTotalPedido"
     if (typeof row[column] === 'function') {
      return row[column]();
    }

    return row[column];
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  editCall(row: Pedido) {
    this.openDialog('edit', row);
  }

  addNew() {
    this.openDialog('add');
  }

  openDialog(action: 'add' | 'edit', data?: Pedido) {
    const dialogRef = this.dialog.open(EditarPedidoComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { pedido: data, action },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }
  private updateRecord(updatedRecord: AllRooms) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      //this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: AllRooms) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== row.id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  private refreshTable() {
    //this.paginator.pageIndex = 0;
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => console.log());//this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => console.log()//!this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }

  loadData() {

    this.pedidoService.buscarPorEstabelecimentoId(this.usuarioCadastrado?.estabelecimentoId).subscribe({
      next: pedidos => {
        this.pedidos = Array.isArray(pedidos) ? pedidos : [];
        this.dataSource.data = pedidos.map((p: any) => new Pedido().fromDTO(p));
        this.isLoading = false;
        this.refreshTable();
        this.definirFiltroTabela();
        
        /*this.dataSource.filterPredicate = (data: Pedido, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );*/

      },
      error: err => {
        console.error('Erro ao carregar dados dados', err);
      }
    });

    /*this.allRoomService.getAllRooms().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: AllRooms, filter: string) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
      },
      error: (err) => console.error(err),
    });*/

  }

  definirFiltroTabela(){
    this.dataSource.filterPredicate = (data: Pedido, filter: string) => {
      const normalizedFilter = filter.trim().toLowerCase();

      // Função recursiva para extrair todos os valores do objeto
      function flattenValues(obj: any): string[] {
        if (obj === null || obj === undefined) return [];
        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
          return [obj.toString()];
        }
        if (Array.isArray(obj)) {
          return obj.flatMap(item => flattenValues(item));
        }
        if (typeof obj === 'object') {
          return Object.values(obj).flatMap(val => flattenValues(val));
        }
        return [];
      }

      const allValues = flattenValues(data);
      return allValues.some(val => val.toLowerCase().includes(normalizedFilter));
    };

    this.dataSource.sortingDataAccessor = (item: Pedido, property: string): any => {
      switch (property) {
        // Campo aninhado: itensAgrupados.nome
        case 'itensAgrupados.nome':
          let itensAgrupados = Object.assign(new ItensAgrupados(), item.itensAgrupados)
          
          if(itensAgrupados instanceof ItensAgrupados){
            return Number(itensAgrupados?.nome ?? 0);
          }
          return '';
        // Campo calculado: calcularTotalPedido
        case 'calcularTotalPedido':
          return item.calcularTotalPedido(); // retorna número

        default:
          const value = (item as any)[property];
          return typeof value === 'string' ? value.toLowerCase() : value;
      }
    };
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  /*exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Room No': x.roomNo,
      'AC/Non AC': x.acNonac,
      Meal: x.meal,
      Mobile: x.mobile,
      'Room Type': x.roomType,
      Rent: x.rent,
      Capacity: x.capacity,
      Status: x.status,
    }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }*/
}
