import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class GeminiApiService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  private genAI: any;

  constructor(private http: HttpClient) {}

  generateContent(apiKey: string, prompt: string): Observable<any> {
    const url = `${this.apiUrl}?key=${apiKey}`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Crie um texto de vendas profissional e persuasivo para o seguinte produto:
               ${prompt}
               1- Descreva o produto de forma atraente e informativa.
               2- Destaque as características principais e benefícios do produto.
               3- Use termos de vendas persuasivos e chamativos.
               4- Inclua preços competitivos e informações sobre frete.
               5- sempre inclua um beneficio extra, exemplo: ao comprar esse fone de ouvido voce ganhara um gift card spotify premium por 1 mes totalmente gratis
               6- nao utilize caracteres como # - * ** nem textos em negrito ou italico
               7- sempre termine com um CTA
               8- seu objetivo é encontrar e organizar argumentos que são irrefutáveis para convencer quem está lendo a comprar
               9- sempre mostra a Transformação que o produto trás.
               `
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
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

    return this.http.post(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao chamar a API Gemini:', error);
        return throwError(() => new Error('Falha ao gerar o texto de vendas. Por favor, verifique sua chave de API e tente novamente.'));
      })
    );
  }
}