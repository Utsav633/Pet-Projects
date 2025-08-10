import { RedditApiResponse, RedditPost } from '../types/reddit';

export class RedditApiService {
  private static readonly BASE_URL = '/api/reddit';

  static async fetchPosts(subreddit: string = 'popular', limit: number = 25): Promise<RedditPost[]> {
    try {
      const url = `${this.BASE_URL}/r/${subreddit}.json?limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data: RedditApiResponse = await response.json();
      return data.data.children.map(child => child.data);
    } catch (error) {
      console.error('Error fetching Reddit posts:', error);
      throw error;
    }
  }

  static formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const postTime = timestamp * 1000;
    const diff = now - postTime;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  }

  static formatScore(score: number): string {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
  }
}