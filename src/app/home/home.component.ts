import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

// Definindo enums para as configurações de segurança
enum HarmCategory {
  HARM_CATEGORY_HARASSMENT = 'HARM_CATEGORY_HARASSMENT',
  HARM_CATEGORY_HATE_SPEECH = 'HARM_CATEGORY_HATE_SPEECH',
  HARM_CATEGORY_SEXUALLY_EXPLICIT = 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  HARM_CATEGORY_DANGEROUS_CONTENT = 'HARM_CATEGORY_DANGEROUS_CONTENT'
}

enum HarmBlockThreshold {
  BLOCK_MEDIUM_AND_ABOVE = 'BLOCK_MEDIUM_AND_ABOVE'
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  apiKeyForm: FormGroup;
  apiKeySaved = false;
  showApiKey: boolean = false;
  apiKeyTestResult: string | null = null;
  apiKeyTestSuccess: boolean = false;
  isTestingApi: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.apiKeyForm = this.fb.group({
      apiKey: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if API key is already saved
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      this.apiKeyForm.get('apiKey')?.setValue(savedApiKey);
      this.apiKeySaved = true;
    }
  }

  toggleApiKeyVisibility(): void {
    this.showApiKey = !this.showApiKey;
  }

  testApiKey(): void {
    if (this.apiKeyForm.valid) {
      this.isTestingApi = true;
      this.apiKeyTestResult = null;
      
      const apiKey = this.apiKeyForm.get('apiKey')?.value;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: "Olá, este é um teste de conexão com a API Gemini 2.5 Flash. Por favor, responda com 'Conexão bem-sucedida'."
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 10,
          thinkingConfig: {
            thinkingBudget: 0
          }
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          }
        ]
      };

      this.http.post(apiUrl, requestBody)
        .pipe(
          catchError(error => {
            console.error('Erro ao testar API:', error);
            this.apiKeyTestSuccess = false;
            if (error.status === 400) {
              this.apiKeyTestResult = 'Erro: Chave de API inválida ou mal formatada.';
            } else if (error.status === 403) {
              this.apiKeyTestResult = 'Erro: Acesso negado. Verifique se sua chave de API tem permissões corretas.';
            } else {
              this.apiKeyTestResult = `Erro ao conectar com a API Gemini: ${error.message || 'Erro desconhecido'}`;
            }
            return of(null);
          }),
          finalize(() => {
            this.isTestingApi = false;
          })
        )
        .subscribe(response => {
          if (response) {
            this.apiKeyTestSuccess = true;
            this.apiKeyTestResult = 'Conexão com a API Gemini 2.5 Flash estabelecida com sucesso!';
          }
        });
    }
  }

  saveApiKey(): void {
    if (this.apiKeyForm.valid) {
      const apiKey = this.apiKeyForm.get('apiKey')?.value;
      localStorage.setItem('geminiApiKey', apiKey);
      this.apiKeySaved = true;
    }
  }

  goToGenerator(): void {
    this.router.navigate(['/product-description-generator']);
  }
}