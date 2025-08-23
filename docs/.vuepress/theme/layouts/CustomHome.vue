<script setup lang="ts">
// 从 VuePress 客户端 API 中导入 usePageFrontmatter hook
import { usePageFrontmatter } from '@vuepress/client'
// 导入 Plume 主题的 Frontmatter 类型定义，以获得类型提示
// import type { PlumeThemeHomeFrontmatter } from 'vuepress-theme-plume'

// 导入你的自定义组件
// 这是标准的、推荐的 .vue 文件导入方式 (默认导入)
import LandingBg from '../components/LandingBg.vue'
import LandingProfile from '../components/LandingProfile.vue'
import LandingNav from '../components/LandingNav.vue'
import LandingHitokoto from '../components/LandingHitokoto.vue'
import LandingToday from '../components/LandingToday.vue'

// 使用 usePageFrontmatter hook 获取当前页面的 frontmatter 数据
// 并使用泛型 <...> 指定其类型，以便 TypeScript 进行类型检查
// const frontmatter = usePageFrontmatter<PlumeThemeHomeFrontmatter>()
</script>

<template>
  <div class="custom-home-layout">
    <!-- 背景组件，它会作为最底层的元素 -->
    <LandingBg />
    
    <!-- 内容容器，用于垂直居中所有核心组件 -->
    <main class="content-wrapper">
      <!-- 今日信息组件 -->
      <LandingToday />
      
      <!-- 个人信息组件 -->
      <LandingProfile />
      
      <!-- 导航链接组件 -->
      <LandingNav />
      
      <!-- “一言”组件 -->
      <LandingHitokoto />
    </main>
  </div>
</template>

<style scoped>
/* scoped 属性确保这里的样式只应用于当前组件，不会污染全局 */

.custom-home-layout {
  position: relative;
  /* 占满整个视口 */
  width: 100vw;
  height: 100vh;
  /* 使用 Flexbox 实现垂直和水平居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 防止内容溢出视口 */
  overflow: hidden;
}

.content-wrapper {
  /* 确保内容在背景之上 */
  position: relative;
  z-index: 1;

  /* 内部元素垂直排列 */
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 设置组件之间的垂直间距 */
  gap: 2rem;
}
</style>