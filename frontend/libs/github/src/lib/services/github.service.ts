import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GitHubIssue, GitHubRepository, PaginationParams } from '../models/github.model';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly baseUrl = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  /**
   * Parsear URL del repositorio de GitHub
   */
  parseRepositoryUrl(url: string): GitHubRepository {
    // Limpiar la URL y extraer owner/repo
    const cleanUrl = url.trim().replace(/\/$/, ''); // Quitar slash final
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
    if (!match) {
      throw new Error('URL de repositorio de GitHub inválida. Formato esperado: https://github.com/owner/repo');
    }
    
    const [, owner, repo] = match;
    return {
      owner: owner.trim(),
      repo: repo.trim(),
      url: cleanUrl
    };
  }

  /**
   * Obtener issues de un repositorio
   */
  getRepositoryIssues(
    repository: GitHubRepository, 
    pagination: PaginationParams = { page: 1, per_page: 10 }
  ): Observable<GitHubIssue[]> {
    const { owner, repo } = repository;
    
    const params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('per_page', pagination.per_page.toString())
      .set('state', 'all') // Obtener issues abiertas y cerradas
      .set('sort', 'updated')
      .set('direction', 'desc');

    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json'
    });

    return this.http.get<GitHubIssue[]>(
      `${this.baseUrl}/repos/${owner}/${repo}/issues`,
      { params, headers }
    );
  }

  /**
   * Verificar si un repositorio existe y es público
   */
  checkRepository(repository: GitHubRepository): Observable<any> {
    const { owner, repo } = repository;
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json'
    });

    return this.http.get(`${this.baseUrl}/repos/${owner}/${repo}`, { headers });
  }
}