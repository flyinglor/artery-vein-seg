<template>
  <view class="pb-20 space-y-4">
    <!-- Header -->
    <view class="mall-header text-white p-6 rounded-b-3xl">
      <view class="flex justify-between items-start">
        <view>
          <text class="text-2xl mb-1">健康商城 🛍️</text>
          <text class="text-blue-100">精选健康产品推荐</text>
        </view>
        <button class="btn-secondary rounded-full">🔍</button>
      </view>
      
      <!-- Search Bar -->
      <view class="search-container">
        <input class="search-input" placeholder="搜索健康产品..." />
      </view>
    </view>

    <!-- Categories -->
    <view class="px-4">
      <view class="categories-scroll">
        <button 
          class="category-btn"
          :class="{ active: selectedCategory === category.id }"
          v-for="category in categories" 
          :key="category.id"
          @click="selectCategory(category.id)"
        >
          <text class="category-icon">{{category.icon}}</text>
          <text class="category-name">{{category.name}}</text>
        </button>
      </view>
    </view>

    <!-- Featured Banner -->
    <view class="px-4">
      <view class="featured-banner">
        <view class="banner-content">
          <text class="banner-title">💊 新用户专享</text>
          <text class="banner-subtitle">维生素套装限时优惠</text>
          <text class="banner-discount">立减 ¥50</text>
        </view>
        <view class="banner-image">
          <text class="banner-emoji">🎁</text>
        </view>
      </view>
    </view>

    <!-- Hot Products -->
    <view class="px-4">
      <view class="section-header">
        <text class="section-title">🔥 热门推荐</text>
        <button class="more-btn">查看更多 →</button>
      </view>
      <view class="products-grid">
        <view class="product-card" v-for="product in hotProducts" :key="product.id" @click="viewProduct(product.id)">
          <view class="product-image">
            <image :src="product.image" class="product-img" mode="aspectFill" />
            <view class="product-badge" v-if="product.badge">{{product.badge}}</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{product.name}}</text>
            <text class="product-desc">{{product.description}}</text>
            <view class="product-rating">
              <text class="rating-stars">{{product.rating}}</text>
              <text class="rating-count">({{product.reviews}})</text>
            </view>
            <view class="product-price-row">
              <text class="product-price">¥{{product.price}}</text>
              <text class="product-original-price" v-if="product.originalPrice">¥{{product.originalPrice}}</text>
            </view>
            <button class="add-to-cart-btn">加入购物车</button>
          </view>
        </view>
      </view>
    </view>

    <!-- Health Plans -->
    <view class="px-4">
      <view class="section-header">
        <text class="section-title">📋 健康计划</text>
        <button class="more-btn">查看更多 →</button>
      </view>
      <view class="plans-list">
        <view class="plan-card" v-for="plan in healthPlans" :key="plan.id">
          <view class="plan-icon" :style="{ background: plan.gradient }">
            <text>{{plan.icon}}</text>
          </view>
          <view class="plan-content">
            <text class="plan-name">{{plan.name}}</text>
            <text class="plan-desc">{{plan.description}}</text>
            <view class="plan-features">
              <text class="feature-item" v-for="feature in plan.features" :key="feature">• {{feature}}</text>
            </view>
            <view class="plan-pricing">
              <text class="plan-price">¥{{plan.price}}</text>
              <text class="plan-period">/{{plan.period}}</text>
            </view>
          </view>
          <button class="plan-subscribe-btn">订阅</button>
        </view>
      </view>
    </view>

    <!-- Health Articles -->
    <view class="px-4">
      <view class="section-header">
        <text class="section-title">📚 健康资讯</text>
        <button class="more-btn">查看更多 →</button>
      </view>
      <view class="articles-list">
        <view class="article-card" v-for="article in healthArticles" :key="article.id" @click="readArticle(article.id)">
          <image :src="article.image" class="article-image" mode="aspectFill" />
          <view class="article-content">
            <text class="article-category">{{article.category}}</text>
            <text class="article-title">{{article.title}}</text>
            <text class="article-excerpt">{{article.excerpt}}</text>
            <view class="article-meta">
              <text class="article-author">{{article.author}}</text>
              <text class="article-date">{{article.date}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Bottom Shopping Cart -->
    <view class="shopping-cart-float" v-if="cartItems > 0">
      <view class="cart-content">
        <view class="cart-icon">🛒</view>
        <text class="cart-count">{{cartItems}}</text>
      </view>
      <text class="cart-text">购物车</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedCategory: 'all',
      cartItems: 0,
      categories: [
        { id: 'all', name: '全部', icon: '🏠' },
        { id: 'vitamins', name: '维生素', icon: '💊' },
        { id: 'supplements', name: '保健品', icon: '🌿' },
        { id: 'fitness', name: '健身', icon: '💪' },
        { id: 'beauty', name: '美容', icon: '✨' },
        { id: 'devices', name: '设备', icon: '⌚' }
      ],
      hotProducts: [
        {
          id: 1,
          name: "复合维生素片",
          description: "每日必需营养素补充",
          price: 89,
          originalPrice: 129,
          rating: "⭐⭐⭐⭐⭐",
          reviews: 1234,
          badge: "热销",
          image: "/static/images/vitamin.jpg"
        },
        {
          id: 2,
          name: "欧米伽3鱼油",
          description: "心脑血管健康守护",
          price: 158,
          originalPrice: 198,
          rating: "⭐⭐⭐⭐⭐",
          reviews: 856,
          badge: "推荐",
          image: "/static/images/omega3.jpg"
        },
        {
          id: 3,
          name: "蛋白粉 香草味",
          description: "优质乳清蛋白 增肌必备",
          price: 299,
          originalPrice: 399,
          rating: "⭐⭐⭐⭐☆",
          reviews: 667,
          badge: "新品",
          image: "/static/images/protein.jpg"
        },
        {
          id: 4,
          name: "益生菌胶囊",
          description: "肠道健康 免疫提升",
          price: 128,
          originalPrice: 168,
          rating: "⭐⭐⭐⭐⭐",
          reviews: 445,
          badge: "",
          image: "/static/images/probiotics.jpg"
        }
      ],
      healthPlans: [
        {
          id: 1,
          name: "减重管理计划",
          description: "科学减重，健康生活",
          icon: "⚖️",
          gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
          features: ["个性化饮食方案", "运动指导", "专家咨询"],
          price: 199,
          period: "月"
        },
        {
          id: 2,
          name: "心血管保健",
          description: "守护心脏，关爱健康",
          icon: "❤️",
          gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
          features: ["心率监测", "饮食建议", "定期检查"],
          price: 299,
          period: "月"
        },
        {
          id: 3,
          name: "营养均衡方案",
          description: "全面营养，活力满满",
          icon: "🥗",
          gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
          features: ["营养分析", "膳食搭配", "补充建议"],
          price: 159,
          period: "月"
        }
      ],
      healthArticles: [
        {
          id: 1,
          title: "维生素D的重要性：如何正确补充",
          excerpt: "维生素D对骨骼健康、免疫系统都有重要作用...",
          category: "营养知识",
          author: "张医生",
          date: "2025-08-18",
          image: "/static/images/vitamin-d.jpg"
        },
        {
          id: 2,
          title: "运动后如何正确补充营养",
          excerpt: "合理的运动后营养补充能够加速恢复...",
          category: "运动健身",
          author: "李教练",
          date: "2025-08-17",
          image: "/static/images/post-workout.jpg"
        },
        {
          id: 3,
          title: "睡眠质量与健康的关系",
          excerpt: "良好的睡眠是健康的基础，如何改善睡眠质量...",
          category: "生活健康",
          author: "王医生",
          date: "2025-08-16",
          image: "/static/images/sleep-health.jpg"
        }
      ]
    }
  },
  methods: {
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      // 根据分类筛选产品
    },
    viewProduct(productId) {
      uni.showToast({
        title: '查看产品详情',
        icon: 'none'
      });
    },
    readArticle(articleId) {
      uni.showToast({
        title: '阅读文章',
        icon: 'none'
      });
    },
    addToCart() {
      this.cartItems++;
      uni.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
    }
  },
  onLoad() {
    console.log('Mall page loaded');
  }
}
</script>

<style lang="scss">
.mall-header {
  background: linear-gradient(to right, #6366f1, #8b5cf6);
}

.search-container {
  margin-top: 20px;
}

.search-input {
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0 16px;
  color: white;
  font-size: 14px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.categories-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  min-width: 80px;
  transition: all 0.2s ease;
  
  &.active {
    background: #6366f1;
    border-color: #6366f1;
    
    .category-icon,
    .category-name {
      color: white;
    }
  }
}

.category-icon {
  font-size: 20px;
}

.category-name {
  font-size: 12px;
  color: #6b7280;
}

.featured-banner {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 16px;
  font-weight: 600;
  color: #92400e;
  display: block;
}

.banner-subtitle {
  font-size: 14px;
  color: #a16207;
  margin: 4px 0;
  display: block;
}

.banner-discount {
  font-size: 20px;
  font-weight: bold;
  color: #dc2626;
  display: block;
}

.banner-image {
  .banner-emoji {
    font-size: 48px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.more-btn {
  font-size: 14px;
  color: #6366f1;
  background: transparent;
  border: none;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.product-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.product-image {
  position: relative;
  height: 120px;
  background: #f3f4f6;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
}

.product-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.product-desc {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.rating-stars {
  font-size: 12px;
}

.rating-count {
  font-size: 12px;
  color: #6b7280;
}

.product-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #ef4444;
}

.product-original-price {
  font-size: 12px;
  color: #9ca3af;
  text-decoration: line-through;
}

.add-to-cart-btn {
  width: 100%;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
}

.plans-list {
  .plan-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 16px;
  }
  
  .plan-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }
  
  .plan-content {
    flex: 1;
  }
  
  .plan-name {
    font-size: 16px;
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
  }
  
  .plan-desc {
    font-size: 14px;
    color: #6b7280;
    display: block;
    margin-bottom: 8px;
  }
  
  .plan-features {
    margin-bottom: 8px;
    
    .feature-item {
      font-size: 12px;
      color: #4b5563;
      display: block;
    }
  }
  
  .plan-pricing {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  
  .plan-price {
    font-size: 18px;
    font-weight: bold;
    color: #ef4444;
  }
  
  .plan-period {
    font-size: 14px;
    color: #6b7280;
  }
  
  .plan-subscribe-btn {
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    height: fit-content;
    align-self: center;
  }
}

.articles-list {
  .article-card {
    background: white;
    border-radius: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    gap: 12px;
  }
  
  .article-image {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }
  
  .article-content {
    flex: 1;
    padding: 12px;
  }
  
  .article-category {
    background: #ddd6fe;
    color: #7c2d12;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    display: inline-block;
    margin-bottom: 4px;
  }
  
  .article-title {
    font-size: 14px;
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
  }
  
  .article-excerpt {
    font-size: 12px;
    color: #6b7280;
    display: block;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .article-meta {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #9ca3af;
  }
}

.shopping-cart-float {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: #6366f1;
  color: white;
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  z-index: 1000;
}

.cart-content {
  position: relative;
  
  .cart-icon {
    font-size: 20px;
  }
  
  .cart-count {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ef4444;
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
}

.cart-text {
  font-size: 14px;
}

// Common styles
.space-y-4 > * + * {
  margin-top: 16px;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.pb-20 {
  padding-bottom: 80px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 8px;
}

.mb-1 {
  margin-bottom: 4px;
}

.text-2xl {
  font-size: 24px;
}

.text-blue-100 {
  color: rgba(219, 234, 254, 1);
}

.rounded-full {
  border-radius: 50%;
}

.rounded-b-3xl {
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
}
</style>