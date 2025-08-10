(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function r(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=r(t);fetch(t.href,o)}})();const d=class d{static async fetchPosts(e="popular",r=25){try{const s=`${this.BASE_URL}/r/${e}.json?limit=${r}`,t=await fetch(s);if(!t.ok)throw new Error(`Failed to fetch posts: ${t.statusText}`);return(await t.json()).data.children.map(i=>i.data)}catch(s){throw console.error("Error fetching Reddit posts:",s),s}}static formatTimeAgo(e){const r=Date.now(),s=e*1e3,t=r-s,o=Math.floor(t/(1e3*60)),i=Math.floor(t/(1e3*60*60)),a=Math.floor(t/(1e3*60*60*24));return a>0?`${a}d ago`:i>0?`${i}h ago`:o>0?`${o}m ago`:"just now"}static formatScore(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}k`:e.toString()}};d.BASE_URL="/api/reddit";let n=d;class c{constructor(){this.posts=[],this.loading=!1,this.selectedSubreddit="popular",this.subreddits=["popular","javascript","programming","technology","webdev","reactjs","typescript"],this.init()}init(){this.createUI(),this.attachEventListeners(),this.fetchPosts()}createUI(){const e=document.getElementById("root");e.innerHTML=`
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
              ${this.subreddits.map(r=>`
                <button 
                  class="subreddit-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${this.selectedSubreddit===r?"bg-blue-600 text-white":"bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"}" 
                  data-subreddit="${r}"
                >
                  r/${r}
                </button>
              `).join("")}
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
    `}attachEventListeners(){document.getElementById("refresh-btn").addEventListener("click",()=>this.handleRefresh()),document.querySelectorAll(".subreddit-btn").forEach(s=>{s.addEventListener("click",t=>{const i=t.target.dataset.subreddit;this.handleSubredditChange(i)})})}async fetchPosts(){this.loading=!0,this.showLoading();try{this.posts=await n.fetchPosts(this.selectedSubreddit,20),this.renderPosts()}catch(e){this.showError(e instanceof Error?e.message:"Failed to fetch posts")}finally{this.loading=!1}}showLoading(){const e=document.getElementById("content");e.innerHTML=`
      <div id="loading" class="flex items-center justify-center py-12">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
          <div class="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
      </div>
    `}showError(e){const r=document.getElementById("content");r.innerHTML=`
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="flex flex-col items-center gap-3">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-1">Something went wrong</h3>
            <p class="text-red-600 mb-4">${e}</p>
            <button id="retry-btn" class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    `,document.getElementById("retry-btn").addEventListener("click",()=>this.fetchPosts())}renderPosts(){const e=document.getElementById("content");if(this.posts.length===0){e.innerHTML=`
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">No posts found</p>
        </div>
      `;return}e.innerHTML=`
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Posts from r/${this.selectedSubreddit}
        </h2>
        <p class="text-gray-600 mt-1">
          ${this.posts.length} posts loaded
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        ${this.posts.map(r=>this.renderPost(r)).join("")}
      </div>
    `}renderPost(e){const r=this.getThumbnailUrl(e),s=`https://www.reddit.com${e.permalink}`;return`
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div class="p-6">
          <!-- Post Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm text-gray-500">
              r/${e.subreddit} • u/${e.author} • ${n.formatTimeAgo(e.created_utc)}
            </div>
          </div>

          <!-- Post Content -->
          <div class="flex gap-4">
            ${r?`
              <div class="flex-shrink-0">
                <img
                  src="${r}"
                  alt="Post thumbnail"
                  class="w-20 h-20 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            `:""}

            <!-- Post Details -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-3 leading-snug">
                ${e.title}
              </h3>

              <!-- Post Stats -->
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <span>${n.formatScore(e.score)}</span>
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span>${e.num_comments}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Post Actions -->
          <div class="mt-4 flex gap-2">
            <a
              href="${s}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              View on Reddit
            </a>
            ${e.url!==s?`
              <a
                href="${e.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Original Link
              </a>
            `:""}
          </div>
        </div>
      </div>
    `}getThumbnailUrl(e){var r,s,t,o;return(o=(t=(s=(r=e.preview)==null?void 0:r.images)==null?void 0:s[0])==null?void 0:t.source)!=null&&o.url?e.preview.images[0].source.url.replace(/&amp;/g,"&"):e.thumbnail&&e.thumbnail!=="self"&&e.thumbnail!=="default"&&e.thumbnail.startsWith("http")?e.thumbnail:null}handleRefresh(){this.fetchPosts()}handleSubredditChange(e){this.selectedSubreddit=e,this.updateSubredditButtons(),this.fetchPosts()}updateSubredditButtons(){document.querySelectorAll(".subreddit-btn").forEach(r=>{const s=r;s.dataset.subreddit===this.selectedSubreddit?s.className="subreddit-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-blue-600 text-white":s.className="subreddit-btn px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"})}}new c;
