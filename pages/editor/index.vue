<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="articleAbout" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="content" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="tag" type="text" class="form-control" placeholder="Enter tags" @keydown.enter="addTag">
                  <div class="tag-list" v-for="(item, index) in tagList" :key="item">
                    <i class="ion-close-round" @click="deleteTag(index)"></i> {{ item }}
                  </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="publishArticle">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { createArticle } from '@/api/article'
export default {
  name: 'EditPage',
  middleware: ['authenticated'],
  data() {
    return {
      title: '',
      articleAbout: '',
      content: '',
      tag: '',
      tagList: []
    }
  },
  methods: {
    addTag() {
      if (this.tag) {
        this.tagList.push(this.tag)
        this.tag = ""
      }
    },
    deleteTag(index) {
      this.tagList.slice(index, 1)
    },
    publishArticle() {
      createArticle({
        article: {
          title: this.title,
          description: this.articleAbout,
          body: this.content,
          tagList: this.tagList
        }
      }).then(res => {
        this.title = '',
        this.articleAbout = '',
        this.content = '',
        this.tag = '',
        this.tagList = []
      })
    }
  }
}
</script>

<style>

</style>