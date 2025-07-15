import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  promptForm: FormGroup;
  currentPrompt = '';
  showSuccessMessage = false;

  constructor(private fb: FormBuilder) {
    this.promptForm = this.fb.group({
      promptTemplate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load the current prompt template from storage
    const savedPrompt = localStorage.getItem('promptTemplate');
    if (savedPrompt) {
      this.currentPrompt = savedPrompt;
      this.promptForm.get('promptTemplate')?.setValue(savedPrompt);
    } else {
      // Default prompt template
      const defaultPrompt = `Crie um texto de vendas profissional e persuasivo para o seguinte produto:
{productName}
1- Descreva o produto de forma atraente e informativa.
2- Destaque as características principais e benefícios do produto.
3- Use termos de vendas persuasivos e chamativos.
4- Inclua preços competitivos e informações sobre frete.
5- sempre inclua um beneficio extra, exemplo: ao comprar esse fone de ouvido voce ganhara um gift card spotify premium por 1 mes totalmente gratis
6- nao utilize caracteres como # - * ** nem textos em negrito ou italico
7- sempre termine com um CTA
8- seu objetivo é encontrar e organizar argumentos que são irrefutáveis para convencer quem está lendo a comprar
9- sempre mostra a Transformação que o produto trás.`;
      this.currentPrompt = defaultPrompt;
      this.promptForm.get('promptTemplate')?.setValue(defaultPrompt);
    }
  }

  savePrompt(): void {
    if (this.promptForm.valid) {
      const newPrompt = this.promptForm.get('promptTemplate')?.value;
      localStorage.setItem('promptTemplate', newPrompt);
      this.currentPrompt = newPrompt;
      
      // Show success message
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  }

  resetPrompt(): void {
    const defaultPrompt = `Crie um texto de vendas profissional e persuasivo para o seguinte produto:
{productName}
1- Descreva o produto de forma atraente e informativa.
2- Destaque as características principais e benefícios do produto.
3- Use termos de vendas persuasivos e chamativos.
4- Inclua preços competitivos e informações sobre frete.
5- sempre inclua um beneficio extra, exemplo: ao comprar esse fone de ouvido voce ganhara um gift card spotify premium por 1 mes totalmente gratis
6- nao utilize caracteres como # - * ** nem textos em negrito ou italico
7- sempre termine com um CTA
8- seu objetivo é encontrar e organizar argumentos que são irrefutáveis para convencer quem está lendo a comprar
9- sempre mostra a Transformação que o produto trás.`;
    this.promptForm.get('promptTemplate')?.setValue(defaultPrompt);
  }
}
