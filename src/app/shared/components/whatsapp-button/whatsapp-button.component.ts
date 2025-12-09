import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-whatsapp-button',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent {

  @Input() mensagem: string = 'Olá, seu pedido foi confirmado!';
  
  showInput: boolean = false;
  telefone: string = '';

  toggleInput() {
    this.showInput = true;
  }

  formatarTelefoneParaURL(): string {
    return this.telefone.replace(/\D/g, '');
  }

  enviarWhatsApp() {
    const numero = this.formatarTelefoneParaURL();
    if (!numero) return;

    const mensagemEncode = encodeURIComponent(this.mensagem);
    const url = `https://wa.me/${numero}?text=${mensagemEncode}`;
    window.open(url, '_blank');
  }

}
