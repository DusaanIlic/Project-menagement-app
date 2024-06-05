import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LLMResponse} from "../models/llm-response";

const LLM_API = 'http://kraguj.pmf.kg.ac.rs:12325/api';

@Injectable({
  providedIn: 'root',
})
export class LLMService {
  constructor(private http: HttpClient) {

  }

  generateText(question: string): Observable<LLMResponse> {
    return this.http.post<LLMResponse>(`${LLM_API}/generate`, {
      'model': 'llama3',
      'prompt': question,
      'stream': false
    });
  }
}
