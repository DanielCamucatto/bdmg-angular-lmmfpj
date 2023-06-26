// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Address } from '../../interface/address';
// import { ViaCepService } from '../../services/viacep.service';
// import { FormControl } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { PopupComponent } from '../popup/popup.component';

// @Component({
//   selector: 'app-form',
//   templateUrl: './form.component.html',
//   providers: [ViaCepService]
// })
// export class FormComponent implements OnInit {
//   enderecoForm: FormGroup;
//   endereco: Address;

//   constructor(
//     private formBuilder: FormBuilder, 
//     private viaCepService: ViaCepService,
//     private dialog: MatDialog
//     ) {
//     this.enderecoForm = this.formBuilder.group({
//       nome: ['', Validators.required],
//       cep: ['',Validators.required],
//       logradouro: ['', Validators.required],
//       complemento: ['', Validators.required],
//       bairro: ['', Validators.required],
//       localidade: ['', Validators.required],
//       uf: ['', Validators.required],
//       ddd: ['', Validators.required],
//       gia: [''],
//       ibge: [''],
//       siafi: [''],
//       telefone: ['', Validators.required]
//     });
//     this.endereco = {
//       nome: '',
//       cep: '',
//       logradouro: '',
//       complemento: '',
//       bairro: '',
//       localidade: '',
//       uf: '',
//       ddd: '',
//       gia: '',
//       ibge: '',
//       siafi: '',
//       telefone: ''
//     };
//   }


//   ngOnInit() {
//     const dadosString = localStorage.getItem('endereco');
//     if (dadosString) {
//       this.endereco = JSON.parse(dadosString) as Address;
//       this.enderecoForm.patchValue(this.endereco);
//     }
//   }

//   compararDados(dadosCep: Address, dadosFormulario: any): boolean {
//     if (
//       dadosCep.logradouro === dadosFormulario.logradouro &&
//       dadosCep.complemento === dadosFormulario.complemento &&
//       dadosCep.bairro === dadosFormulario.bairro &&
//       dadosCep.localidade === dadosFormulario.localidade &&
//       dadosCep.uf === dadosFormulario.uf
//     ) {
//       return true; // Dados coincidem
//     } else {
//       return false; // Dados não coincidem
//     }
//   }
  
//   salvarEndereco() {
//     if (this.enderecoForm.valid) {
//       const cep = this.enderecoForm.value.cep;
//       this.viaCepService.getEndereco(cep).subscribe(data => {
//         this.endereco = data as Address;
//         this.endereco.nome = this.enderecoForm.value.nome;
//         this.endereco.telefone = this.enderecoForm.value.telefone;
//         localStorage.setItem('endereco', JSON.stringify(this.endereco));
  
//         // Comparar os dados do CEP com os dados do formulário
//         if (!this.compararDados(this.endereco, this.enderecoForm.value)) {
//           // Dados não coincidem, exibir popup
//           this.exibirPopup();
//         }
  
//         console.log(this.endereco);
//         this.enderecoForm.reset();
//       });
//     }
//   }
  

//   aplicarMascaraCep(event: any) {
//     const cepControl = new FormControl(event.target.value);
//     const cep = cepControl.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
//     const mascara = /^(\d{5})(\d{3})$/;
//     const cepFormatado = cep.replace(mascara, '$1-$2');
//     this.enderecoForm.patchValue({ cep: cepFormatado });
//   }

//   aplicarMascaraComplemento(event: any) {
//     const complementoControl = new FormControl(event.target.value);
//     const complemento = complementoControl.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
//     const mascara = /^(\d{1})(\d{3})$/;
//     const complementoFormatado = complemento.replace(mascara, '$1.$2');
//     this.enderecoForm.patchValue({ complemento: complementoFormatado });
//   }

//   openPopup() {
//     this.dialog.open(PopupComponent, {
//       data: {
//         title: 'Título do Popup',
//         message: 'Mensagem do popup.'
//       }
//     });
//   }
  
//   exibirPopup() {
//     const dialogRef = this.dialog.open(PopupComponent, {
//       width: '50vw',
//       data: {
//         title: 'Isso é um titulo', 
//         mensagem: 'Os dados não coincidem!' }
//     });
  
//     dialogRef.afterClosed().subscribe(result => {
//       console.log('O popup foi fechado.');
//     });
//   }
// }




// ++++++++++++++++++++++++ NOVO CODIGO  +++++++++++++++++++++++++++++++++++++++++

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../interface/address';
import { ViaCepService } from '../../services/viacep.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [ViaCepService]
})
export class FormComponent implements OnInit {
  enderecoForm: FormGroup;
  endereco: Address;
  isFormVisible: boolean = true;
  isConfirmationVisible: boolean = false;
  isDataCorrect: boolean = true;
  dadosIncorretos: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private viaCepService: ViaCepService,
    private dialog: MatDialog
  ) {
    this.enderecoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      complemento: ['', Validators.required],
      bairro: ['', Validators.required],
      localidade: ['', Validators.required],
      uf: ['', Validators.required],
      ddd: ['', Validators.required],
      gia: [''],
      ibge: [''],
      siafi: [''],
      telefone: ['', Validators.required]
    });
    this.endereco = {
      nome: '',
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
      ddd: '',
      gia: '',
      ibge: '',
      siafi: '',
      telefone: ''
    };
  }

  ngOnInit() {
    this.enderecoForm.reset();
  }

  compararDados(dadosCep: Address, dadosFormulario: any): boolean {
    this.dadosIncorretos = [];
 
    if (dadosCep.localidade !== dadosFormulario.localidade) {
      this.dadosIncorretos.push('localidade');
    }
    
    if (dadosCep.uf !== dadosFormulario.uf) {
      this.dadosIncorretos.push('uf');
    }

    return this.dadosIncorretos.length === 0;
  }

  salvarEndereco() {
    if (this.enderecoForm.valid) {
      const cep = this.enderecoForm.value.cep;
      this.viaCepService.getEndereco(cep).subscribe(data => {
        this.endereco = data as Address;
        this.endereco.nome = this.enderecoForm.value.nome;
        this.endereco.telefone = this.enderecoForm.value.telefone;
  
        // Comparar os dados do CEP com os dados do formulário
        this.isDataCorrect = this.compararDados(this.endereco, this.enderecoForm.value);
  
        if (this.isDataCorrect) {
          localStorage.setItem('endereco', JSON.stringify(this.endereco));
          this.isFormVisible = false;
          this.isConfirmationVisible = true;
        } else {
          this.exibirPopup();
        }
  
        console.log(this.endereco);
      });
    }
  }
  

  voltarParaFormulario() {
    this.isFormVisible = true;
    this.isConfirmationVisible = false;
    this.enderecoForm.reset();
  }

  aplicarMascaraCep(event: any) {
    const cepControl = new FormControl(event.target.value);
    const cep = cepControl.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const mascara = /^(\d{5})(\d{3})$/;
    const cepFormatado = cep.replace(mascara, '$1-$2');
    this.enderecoForm.patchValue({ cep: cepFormatado });
  }

  aplicarMascaraComplemento(event: any) {
    const complementoControl = new FormControl(event.target.value);
    const complemento = complementoControl.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const mascara = /^(\d{1})(\d{3})$/;
    const complementoFormatado = complemento.replace(mascara, '$1.$2');
    this.enderecoForm.patchValue({ complemento: complementoFormatado });
  }

  exibirPopup() {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '50vw',
      data: {
        title: 'Dados Incorretos',
        mensagem: 'Os dados digitados não coincidem com os dados do CEP.',
        dadosIncorretos: this.dadosIncorretos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O popup foi fechado.');
    });
  }
}

