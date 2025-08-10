export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  comments: number;
  html_url: string;
}

export interface GitHubRepository {
  owner: string;
  repo: string;
  url: string;
}

export interface IssuesState {
  issues: GitHubIssue[];
  repository: GitHubRepository | null;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  per_page: number;
}