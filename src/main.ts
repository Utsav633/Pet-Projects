import './style.css';
import { RedditApiService } from './services/redditApi';
import { RedditPost } from './types/reddit';

class RedditApp {
  private posts: RedditPost[] = [];
  private loading = false;
  private selectedSubreddit = 'popular';
  private readonly subreddits = [
    'popular',
    'javascript',
    'programming',
    'technology',
    'webdev',
    'reactjs',
    'typescript'
  ];

  constructor() {
    this.init();
  }

  private init(): void {
    this.createUI();
    this.attachEventListeners();
    this.fetchPosts();
  }

  private createUI(): void {
    const app = document.getElementById('root')!;
    app.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <div class="flex items-center gap-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                </svg>
                <h1 class="text-xl font-bold text-gray-900">Reddit Feed</h1>
              </div>
              
              <button id="refresh-btn" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Subreddit Selector -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Choose a Subreddit</h2>
            <div id="subreddit-buttons" class="flex flex-wrap gap-2">
              ${this.subreddits.map(subreddit => `
                <button 
                  class="subreddit-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    this.selectedSubreddit === subreddit
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }" 
                  data-subreddit="${subreddit}"
                >
                  r/${subreddit}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Content -->
          <div id="content">
            <div id="loading" class="flex items-center justify-center py-12">
              <div class="relative">
                <div class="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
                <div class="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn')!;
    refreshBtn.addEventListener('click', () => this.handleRefresh());

    // Subreddit buttons
    const subredditButtons = document.querySelectorAll('.subreddit-btn');
    subredditButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const subreddit = target.dataset.subreddit!;
        this.handleSubredditChange(subreddit);
      });
    });
  }

  private async fetchPosts(): Promise<void> {
    this.loading = true;
    this.showLoading();

    try {
      this.posts = await RedditApiService.fetchPosts(this.selectedSubreddit, 20);
      this.renderPosts();
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      this.loading = false;
    }
  }

  private showLoading(): void {
    const content = document.getElementById('content')!;
    content.innerHTML = `
      <div id="loading" class="flex items-center justify-center py-12">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
          <div class="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    `;
  }

  private showError(message: string): void {
    const content = document.getElementById('content')!;
    content.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="flex flex-col items-center gap-3">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-1">Something went wrong</h3>
            <p class="text-red-600 mb-4">${message}</p>
            <button id="retry-btn" class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    `;

    const retryBtn = document.getElementById('retry-btn')!;
    retryBtn.addEventListener('click', () => this.fetchPosts());
  }

  private renderPosts(): void {
    const content = document.getElementById('content')!;
    
    if (this.posts.length === 0) {
      content.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">No posts found</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Posts from r/${this.selectedSubreddit}
        </h2>
        <p class="text-gray-600 mt-1">
          ${this.posts.length} posts loaded
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        ${this.posts.map(post => this.renderPost(post)).join('')}
      </div>
    `;
  }

  private renderPost(post: RedditPost): string {
    const thumbnailUrl = this.getThumbnailUrl(post);
    const redditUrl = `https://www.reddit.com${post.permalink}`;

    return `
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="p-6">
          <!-- Post Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm text-gray-500">
              r/${post.subreddit} • u/${post.author} • ${RedditApiService.formatTimeAgo(post.created_utc)}
            </div>
          </div>

          <!-- Post Content -->
          <div class="flex gap-4">
            ${thumbnailUrl ? `
              <div class="flex-shrink-0">
                <img
                  src="${thumbnailUrl}"
                  alt="Post thumbnail"
                  class="w-20 h-20 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ` : ''}

            <!-- Post Details -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-3 leading-snug">
                ${post.title}
              </h3>

              <!-- Post Stats -->
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <span>${RedditApiService.formatScore(post.score)}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span>${post.num_comments}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Post Actions -->
          <div class="mt-4 flex gap-2">
            <a
              href="${redditUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              View on Reddit
            </a>
            ${post.url !== redditUrl ? `
              <a
                href="${post.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Original Link
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  private getThumbnailUrl(post: RedditPost): string | null {
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && post.thumbnail.startsWith('http')) {
      return post.thumbnail;
    }
    return null;
  }

  private handleRefresh(): void {
    this.fetchPosts();
  }

  private handleSubredditChange(subreddit: string): void {
    this.selectedSubreddit = subreddit;
    this.updateSubredditButtons();
    this.fetchPosts();
  }

  private updateSubredditButtons(): void {
    const buttons = document.querySelectorAll('.subreddit-btn');
    buttons.forEach(btn => {
      const button = btn as HTMLButtonElement;
      const subreddit = button.dataset.subreddit!;
      
      if (subreddit === this.selectedSubreddit) {
        button.className = 'subreddit-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-blue-600 text-white';
      } else {
        button.className = 'subreddit-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300';
      }
    });
  }
}

// Initialize the app
new RedditApp();