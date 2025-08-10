import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  ExternalLink,
  MessageSquare,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Tag,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search
} from 'lucide-angular';
import { GitHubStore } from '@github-issues-manager/github';

@Component({
  selector: 'lib-issues-list', // ← Debe ser exactamente esto
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './issues-list.html',
  styleUrl: './issues-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesList {
  githubStore = inject(GitHubStore);

  readonly icons = {
    ExternalLink,
    MessageSquare,
    Calendar,
    User,
    AlertCircle,
    CheckCircle,
    Tag,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Search
  };

  currentPage = signal(1);

  /**
   * Formatear fecha relativa
   */
  formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `hace ${Math.ceil(diffDays / 30)} meses`;
    return `hace ${Math.ceil(diffDays / 365)} años`;
  }

  /**
   * Obtener color para el estado de la issue
   */
  getStateColor(state: string): string {
    return state === 'open' ? 'text-green-400' : 'text-purple-400';
  }

  /**
   * Obtener ícono para el estado
   */
  getStateIcon(state: string) {
    return state === 'open' ? this.icons.AlertCircle : this.icons.CheckCircle;
  }

  /**
   * Navegar a página anterior
   */
  previousPage() {
    const current = this.currentPage();
    if (current > 1) {
      this.currentPage.set(current - 1);
      this.githubStore.loadNextPage(current - 1);
    }
  }

  /**
   * Navegar a página siguiente
   */
  nextPage() {
    const current = this.currentPage();
    this.currentPage.set(current + 1);
    this.githubStore.loadNextPage(current + 1);
  }

  /**
   * Abrir issue en GitHub
   */
  openInGitHub(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Truncar texto largo
   */
  truncateText(text: string, maxLength: number = 150): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * TrackBy function para optimizar el renderizado
   */
  trackByIssueId(index: number, issue: any): number {
    return issue.id;
  }
}