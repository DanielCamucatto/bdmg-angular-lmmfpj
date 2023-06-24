import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../interface/address';
import { ViaCepService } from '../../services/viacep.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [ViaCepService]
})
export class FormComponent implements OnInit {
  enderecoForm: FormGroup;
  endereco: Address;

  constructor(private formBuilder: FormBuilder, private viaCepService: ViaCepService) {
    this.enderecoForm = this.formBuilder.group({
      cep: ['', Validators.required],
      logradouro: [''],
      complemento: [''],
      bairro: [''],
      localidade: [''],
      uf: [''],
      ddd: [''],
      gia: [''],
    });
    this.endereco = {
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
      ddd: '',
      gia: '',
      ibge: '',
      siafi: ''
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
      const cepControl = this.enderecoForm.get('cep');
      if (cepControl) {
        const cep = cepControl.value;
        this.viaCepService.getEndereco(cep).subscribe(data => {
          this.endereco = data as Address;
          localStorage.setItem('endereco', JSON.stringify(this.endereco));
          console.log(this.endereco);
          this.enderecoForm.reset();
          
        });
      }
    }
  }
}
