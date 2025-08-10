GitHub Issues Manager GitHub Issues Manager is a full-stack Angular application for exploring and managing GitHub repository issues with user authentication. ## Installation Use Node.js 18+ and npm to install the project dependencies. 
### Backend Setup 
``` bash 
cd backend 
npm install 
npm run develop 
``` 
### Frontend Setup 
``` bash 
cd frontend
npm install 
nx serve web
```  
## Initial Configuration 
### Strapi Configuration 
1. Open http://localhost:1337/admin 
2. Create admin user 
3. Go to Settings → Users & Permissions Plugin → Roles 
4. Public role: Enable register in auth 
5. Authenticated role: Enable me in users-permissions 
## Usage 
### Authentication 
``` typescript 
// Register 
new user const user = await authService.register({ 
    username: 'john_doe', 
    email: 'john@example.com', 
    password: 'password123' }); 
    
// Login 
user const response = await authService.login({ 
    identifier: 'john@example.com', 
    password: 'password123' 
}); 
```

### Search GitHub Issues 
``` typescript 
// Search repository issues 
const repository = 'https://github.com/facebook/react'; 
githubStore.loadIssuesFromUrl({ repoUrl: repository, page: 1 }); 

// Navigate pages 
githubStore.loadNextPage(2);  
```

### Application Flow 
``` bash 
1. Register/Login → Authentication with Strapi 
2. Enter GitHub URL → Parse repository owner/name 
3. Fetch Issues → GitHub API integration 
4. Display Results → Paginated list with metadata 
``` 

## Project Structure 
```
├── frontend/                   # Angular + Nx monorepo
│   ├── apps/web/              # Main application
│   └── libs/
│       ├── auth/              # Authentication library
│       ├── github/            # GitHub API integration
│       ├── ui/                # Reusable components
│       └── shared/            # Shared utilities
└── backend/                   # Strapi CMS
    ├── config/                # Strapi configuration
    ├── src/api/               # Custom APIs
    └── database/              # SQLite database
```

## Technology Stack - Frontend: 

- Angular 17, Nx Workspace, NgRx Signals, Tailwind CSS 
- Backend: Strapi 5.21, SQLite, JWT Authentication 
- APIs: GitHub API v3 
- Performance: Zone-less change detection, OnPush strategy 
## Development 
``` bash 
# Run tests 
nx test auth 
nx test github 
nx test ui 

# Build production 
nx build web --prod 

# Linting 
nx lint  
```

## Key Features 
- User authentication with Strapi 
- GitHub repository search by URL 
- Paginated issues list with complete metadata 
- Responsive dark mode design 
- Modular Nx architecture with reusable libraries 
- Performance optimized with Zone-less change detection 