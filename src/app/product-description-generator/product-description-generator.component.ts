import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiApiService } from '../gemini-api.service';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-product-description-generator',
  templateUrl: './product-description-generator.component.html',
  styleUrls: ['./product-description-generator.component.scss']
})
export class ProductDescriptionGeneratorComponent implements OnInit {
  productForm: FormGroup;
  generatedDescription = '';
  isLoading = false;
  apiKey = '';

  constructor(
    private fb: FormBuilder,
    private geminiApiService: GeminiApiService,
    private router: Router,
    private auth: Auth
  ) {
    this.productForm = this.fb.group({
      productDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load the API key from localStorage
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
  }

  generateDescription(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      
      // Get form value
      const productDescription = this.productForm.get('productDescription')?.value;
      
      // Check if API key is available
      if (this.apiKey) {
        // Call Gemini API
        this.geminiApiService.generateContent(this.apiKey, productDescription)
          .subscribe({
            next: (response) => {
              // Extract the generated text from the response
              if (response && response.candidates && response.candidates.length > 0 && 
                  response.candidates[0].content && response.candidates[0].content.parts && 
                  response.candidates[0].content.parts.length > 0) {
                this.generatedDescription = response.candidates[0].content.parts[0].text;
              } else {
                this.generatedDescription = 'Não foi possível gerar o texto. Tente novamente.';
              }
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Erro ao chamar a API Gemini:', error);
              this.generatedDescription = 'Erro ao gerar o texto: ' + error.message;
              this.isLoading = false;
            }
          });
      } else {
        // API key not available, redirect to home
        alert('Chave de API não encontrada. Por favor, configure sua chave de API.');
        this.router.navigate(['/home']);
        this.isLoading = false;
      }
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.generatedDescription);
    alert('Descrição copiada para a área de transferência!');
  }

  resetForm(): void {
    this.productForm.reset();
    this.generatedDescription = '';
  }


}
