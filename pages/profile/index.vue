<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <button v-if="user.username !== profile.username" class="btn btn-sm btn-outline-secondary action-btn" @click="followUser">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'UnFollow' : 'Follow' }} {{ profile.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" :class="{ active: tab === 'My_Article' }" :to="{ path: `/profile/${profile.username}`, query: { tab: 'My_Article' } }">My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" :class="{ active: tab === 'Favorited_Articles' }" :to="{ path: `/profile/${profile.username}`, query: { tab: 'Favorited_Articles' } }">Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="item in articles" :key="item.slug">
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
              <ul class="tag-list" v-if="item.tagList.length > 0">
                <li class="tag-default tag-pill tag-outline" v-for="tag in item.tagList" :key="tag">{{ tag }}</li>
              </ul>
            </nuxt-link>
          </div>


        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfile, followUser, unFollowUser } from '@/api/user'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'ProfilePage',
  watchQuery: ['tab'],
  middleware: ['authenticated'],
  async asyncData({ params, query }) {
    const tab = query.tab || 'My_Article'

    let paramsData = {}

    paramsData = tab === 'My_Article' 
    ? { author: params.username }
    : { favorited: params.username }

    const [ profileData, articleData ] = await Promise.all([
      getProfile(params.username),
      getArticles(paramsData)
    ])
    const { profile } = profileData.data
    const { articles, articlesCount } = articleData.data

    return {
      profile,
      articles,
      articlesCount,
      tab
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async followUser() {
      const { data } = this.profile.following ? await unFollowUser(this.profile.username) : await followUser(this.profile.username)
      this.profile = data.profile
    }
  }
}
</script>

<style>

</style>