import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../interface/address';
import { ViaCepService } from '../../services/viacep.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [ViaCepService]
})
export class FormComponent implements OnInit {
  enderecoForm: FormGroup;
  endereco: Address;

  constructor(private formBuilder: FormBuilder, private viaCepService: ViaCepService) {
    this.enderecoForm = this.formBuilder.group({
      nome: [''],
      cep: [''],
      logradouro: [''],
      complemento: [''],
      bairro: [''],
      localidade: [''],
      uf: [''],
      ddd: [''],
      gia: [''],
      telefone: ['']
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
    const dadosString = localStorage.getItem('endereco');
    if (dadosString) {
      this.endereco = JSON.parse(dadosString) as Address;
      this.enderecoForm.patchValue(this.endereco);
    }
  }

  salvarEndereco() {
    if (this.enderecoForm.valid) {
      const cep = this.enderecoForm.value.cep;
      this.viaCepService.getEndereco(cep).subscribe(data => {
        this.endereco = data as Address;
        this.endereco.nome = this.enderecoForm.value.nome;
        this.endereco.telefone = this.enderecoForm.value.telefone;
        localStorage.setItem('endereco', JSON.stringify(this.endereco));
        console.log(this.endereco);
        this.enderecoForm.reset();
      });
    }
  }
}
