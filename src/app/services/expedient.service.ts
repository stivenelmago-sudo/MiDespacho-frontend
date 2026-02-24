import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expedient, DocumentSet } from '../models/expedient.model';

@Injectable({
  providedIn: 'root',
})
export class ExpedientService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  getExpedients(): Observable<Expedient[]> {
    return this.http.get<Expedient[]>(`${this.apiUrl}/expedient`);
  }

  getExpedient(id: string): Observable<Expedient> {
    return this.http.get<Expedient>(`${this.apiUrl}/expedient/${id}`);
  }

  createExpedient(data: Partial<Expedient>): Observable<Expedient> {
    return this.http.post<Expedient>(`${this.apiUrl}/expedient`, data);
  }

  updateExpedient(id: string, data: Partial<Expedient>): Observable<Expedient> {
    return this.http.put<Expedient>(`${this.apiUrl}/expedient/${id}`, data);
  }

  deleteExpedient(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/expedient/${id}`);
  }

  uploadFiles(
    expedientId: string,
    title: string,
    description: string,
    files: File[],
  ): Observable<DocumentSet> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    for (const file of files) {
      formData.append('files', file);
    }

    return this.http.post<DocumentSet>(`${this.apiUrl}/file/upload/${expedientId}`, formData);
  }

  getDocumentSet(documentSetId: string): Observable<DocumentSet> {
    return this.http.get<DocumentSet>(`${this.apiUrl}/file/document-set/${documentSetId}`);
  }

  deleteFile(fileId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/file/${fileId}`);
  }

  deleteDocumentSet(documentSetId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/file/document-set/${documentSetId}`,
    );
  }

  downloadFile(fileId: string): void {
    const downloadUrl = `${this.apiUrl}/file/download/${fileId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    link.click();
  }
}
