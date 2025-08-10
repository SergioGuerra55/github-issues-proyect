import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Github, 
  Search, 
  LogOut,
  User,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-angular';
import { AuthStore } from '@github-issues-manager/auth';
import { GitHubStore } from '@github-issues-manager/github';
import { IssuesList } from '../issues-list/issues-list';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    IssuesList
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  authStore = inject(AuthStore);
  githubStore = inject(GitHubStore);

  readonly icons = {
    Github,
    Search,
    LogOut,
    User,
    ExternalLink,
    Loader2,
    AlertCircle
  };

  repoUrl = signal('');

  onSearch() {
    if (this.repoUrl().trim()) {
      this.githubStore.loadIssuesFromUrl({ 
        repoUrl: this.repoUrl().trim(), 
        page: 1 
      });
    }
  }

  onLogout() {
    this.authStore.logout();
  }

  updateRepoUrl(value: string) {
    this.repoUrl.set(value);
  }
}