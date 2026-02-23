import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expediente, DocumentSet } from '../models/expediente.model';

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  getExpedientes(): Observable<Expediente[]> {
    return this.http.get<Expediente[]>(`${this.apiUrl}/expediente`);
  }

  getExpediente(id: string): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.apiUrl}/expediente/${id}`);
  }

  createExpediente(data: Partial<Expediente>): Observable<Expediente> {
    return this.http.post<Expediente>(`${this.apiUrl}/expediente`, data);
  }

  updateExpediente(id: string, data: Partial<Expediente>): Observable<Expediente> {
    return this.http.put<Expediente>(`${this.apiUrl}/expediente/${id}`, data);
  }

  deleteExpediente(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/expediente/${id}`);
  }

  uploadFiles(
    expedienteId: string,
    titulo: string,
    descripcion: string,
    files: File[],
  ): Observable<DocumentSet> {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);

    for (const file of files) {
      formData.append('files', file);
    }

    return this.http.post<DocumentSet>(`${this.apiUrl}/file/upload/${expedienteId}`, formData);
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
}
