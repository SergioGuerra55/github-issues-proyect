import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { GitHubService } from '../services/github.service';
import { IssuesState, GitHubRepository } from '../models/github.model';

const initialState: IssuesState = {
  issues: [],
  repository: null,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null
};

export const GitHubStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, githubService = inject(GitHubService)) => ({
    
    /**
     * Cargar issues de un repositorio desde una URL
     */
    loadIssuesFromUrl: rxMethod<{ repoUrl: string; page?: number }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ repoUrl, page = 1 }) => {
          try {
            // Parsear la URL del repositorio
            const repository = githubService.parseRepositoryUrl(repoUrl);
            
            return githubService.getRepositoryIssues(repository, { 
              page, 
              per_page: 10 
            }).pipe(
              tap((issues) => {
                patchState(store, {
                  issues,
                  repository,
                  currentPage: page,
                  isLoading: false
                });
              }),
              catchError((error) => {
                const errorMessage = error.status === 404 
                  ? 'Repositorio no encontrado. Verifica que la URL sea correcta y el repositorio sea público.'
                  : error.error?.message || 'Error al cargar las issues del repositorio';
                
                patchState(store, {
                  error: errorMessage,
                  isLoading: false
                });
                return EMPTY;
              })
            );
          } catch (parseError: any) {
            patchState(store, {
              error: parseError.message,
              isLoading: false
            });
            return EMPTY;
          }
        })
      )
    ),

    /**
     * Cargar siguiente página
     */
    loadNextPage: rxMethod<number>(
      pipe(
        tap((page) => patchState(store, { isLoading: true, error: null })),
        switchMap((page) => {
          const repository = store.repository();
          if (!repository) return EMPTY;

          return githubService.getRepositoryIssues(repository, { 
            page, 
            per_page: 10 
          }).pipe(
            tap((issues) => {
              patchState(store, {
                issues,
                currentPage: page,
                isLoading: false
              });
            }),
            catchError((error) => {
              patchState(store, {
                error: error.error?.message || 'Error al cargar la página',
                isLoading: false
              });
              return EMPTY;
            })
          );
        })
      )
    ),

    /**
     * Limpiar estado
     */
    clearIssues(): void {
      patchState(store, initialState);
    },

    /**
     * Limpiar errores
     */
    clearError(): void {
      patchState(store, { error: null });
    }
  }))
);