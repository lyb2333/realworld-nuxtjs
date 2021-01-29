<template>
  <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li v-if="user" class="nav-item">
              <nuxt-link class="nav-link" :class="{ active: tab === 'your_feed' }" exact :to="{ name: 'home', query: { tab: 'your_feed' } }">Your Feed</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" :class="{ active: tab === 'global_feed' }" exact :to="{ name: 'home', query: { tab: 'global_feed' } }">Global Feed</nuxt-link>
            </li>
            <li v-if="tag" class="nav-item">
              <nuxt-link class="nav-link" :class="{ active: tab === 'tag' }" exact :to="{ name: 'home', query: { tab: 'tag', tag: tag } }">#{{ tag }}</nuxt-link>
            </li>
          </ul>
        </div>

        <div 
          class="article-preview"
          v-for="item in articles"
          :key="item.slug"
        >
          <div class="article-meta">
            <nuxt-link :to="{ name: 'profile', params: { username: item.author.username } }"><img :src="item.author.image" /></nuxt-link>
            <div class="info">
              <nuxt-link :to="{ name: 'profile', params: { username: item.author.username } }" class="author">{{ item.author.username }}</nuxt-link>
              <span class="date">{{ item.createdAt | dateFormater('MMM DD, YYYY') }}</span>
            </div>
            <button 
              class="btn btn-outline-primary btn-sm pull-xs-right"
              :class="{ active: item.favorited }"
              :disabled="item.favoriteDisabled"
              @click="onFavorite(item)"
            >
              <i class="ion-heart"></i> {{ item.favoritesCount }}
            </button>
          </div>
          <nuxt-link :to="{ name: 'article', params: { slug: item.slug } }" class="preview-link">
            <h1>{{ item.title }}</h1>
            <p>{{ item.description }}</p>
            <span>Read more...</span>
          </nuxt-link>
        </div>

        <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: tag,
                      tab: tab
                    }
                  }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->

      </div>

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list">
            <nuxt-link :to="{ name:'home', query: {
              tag: item,
              tab: 'tag'
            } }" class="tag-pill tag-default" v-for="item in tags" :key="item">{{ item }}</nuxt-link>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import { getArticles, getYourFeedArticles, addFavorite, deleteFavorite } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: 'HomePage',
  watchQuery: ['page', 'tag', 'tab'],
  async asyncData({ query, store }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tag = query.tag || ''
    const tab = query.tab || 'global_feed'
    const loadArticles = store.state.user && tab === 'your_feed'
    ? getYourFeedArticles
    : getArticles

    const [ data, tagData ] = await Promise.all([
      loadArticles({
        limit,
        tag,
        offset: (page - 1) * limit
      }),
      getTags()
    ])
    
    const { articles, articlesCount } = data.data
    const { tags } = tagData.data

    articles.forEach(item => {
      item.favoriteDisabled = false
    })

    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
  },
  methods: {
    async onFavorite(article) {
      if (!this.user) {
        this.$router.push("/login")
        return
      }
      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style>

</style>