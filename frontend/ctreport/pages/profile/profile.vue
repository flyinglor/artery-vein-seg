<template>
  <view class="pb-20 space-y-4">
    <!-- Profile Header -->
    <view class="profile-header text-white p-6 rounded-b-3xl">
      <view class="profile-info">
        <view class="avatar">
          <image src="/static/images/avatar.jpg" class="avatar-img" mode="aspectFill" />
        </view>
        <view class="user-details">
          <text class="user-name">张三</text>
          <text class="user-subtitle">健康会员 · VIP</text>
          <text class="user-id">ID: HC202508001</text>
        </view>
        <button class="edit-btn">✏️</button>
      </view>
      
      <!-- Health Stats -->
      <view class="health-stats">
        <view class="stat-item">
          <text class="stat-value">87</text>
          <text class="stat-label">健康评分</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">28</text>
          <text class="stat-label">连续天数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">15</text>
          <text class="stat-label">健康目标</text>
        </view>
      </view>
    </view>

    <!-- Quick Actions -->
    <view class="px-4">
      <view class="quick-actions">
        <button class="action-btn" v-for="action in quickActions" :key="action.id" @click="handleAction(action.action)">
          <view class="action-icon" :style="{ background: action.color }">
            <text>{{action.icon}}</text>
          </view>
          <text class="action-label">{{action.label}}</text>
        </button>
      </view>
    </view>

    <!-- Menu Sections -->
    <view class="px-4">
      <!-- Health Management -->
      <view class="menu-section">
        <text class="section-title">🏥 健康管理</text>
        <view class="menu-items">
          <button class="menu-item" v-for="item in healthMenuItems" :key="item.id" @click="navigateTo(item.path)">
            <view class="menu-item-left">
              <text class="menu-icon">{{item.icon}}</text>
              <view class="menu-text">
                <text class="menu-label">{{item.label}}</text>
                <text class="menu-desc" v-if="item.desc">{{item.desc}}</text>
              </view>
            </view>
            <view class="menu-item-right">
              <text class="menu-badge" v-if="item.badge">{{item.badge}}</text>
              <text class="menu-arrow">→</text>
            </view>
          </button>
        </view>
      </view>

      <!-- Settings -->
      <view class="menu-section">
        <text class="section-title">⚙️ 设置</text>
        <view class="menu-items">
          <button class="menu-item" v-for="item in settingsMenuItems" :key="item.id" @click="navigateTo(item.path)">
            <view class="menu-item-left">
              <text class="menu-icon">{{item.icon}}</text>
              <view class="menu-text">
                <text class="menu-label">{{item.label}}</text>
                <text class="menu-desc" v-if="item.desc">{{item.desc}}</text>
              </view>
            </view>
            <view class="menu-item-right">
              <text class="menu-badge" v-if="item.badge">{{item.badge}}</text>
              <text class="menu-arrow">→</text>
            </view>
          </button>
        </view>
      </view>

      <!-- Support -->
      <view class="menu-section">
        <text class="section-title">💡 帮助与支持</text>
        <view class="menu-items">
          <button class="menu-item" v-for="item in supportMenuItems" :key="item.id" @click="navigateTo(item.path)">
            <view class="menu-item-left">
              <text class="menu-icon">{{item.icon}}</text>
              <view class="menu-text">
                <text class="menu-label">{{item.label}}</text>
                <text class="menu-desc" v-if="item.desc">{{item.desc}}</text>
              </view>
            </view>
            <view class="menu-item-right">
              <text class="menu-badge" v-if="item.badge">{{item.badge}}</text>
              <text class="menu-arrow">→</text>
            </view>
          </button>
        </view>
      </view>
    </view>

    <!-- Membership Card -->
    <view class="px-4">
      <view class="membership-card">
        <view class="membership-header">
          <text class="membership-title">💎 会员权益</text>
          <view class="membership-badge">VIP</view>
        </view>
        <text class="membership-desc">尊享专属健康服务，有效期至 2025-12-31</text>
        <view class="membership-benefits">
          <text class="benefit-item">✓ 专家一对一咨询</text>
          <text class="benefit-item">✓ 个性化健康方案</text>
          <text class="benefit-item">✓ 优先预约检查</text>
        </view>
        <button class="renew-btn">续费升级</button>
      </view>
    </view>

    <!-- Version Info -->
    <view class="px-4">
      <view class="version-info">
        <text class="app-name">健康管理 v1.0.0</text>
        <text class="build-info">构建版本: 100</text>
      </view>
    </view>

    <!-- Logout Button -->
    <view class="px-4">
      <button class="logout-btn" @click="logout">
        退出登录
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      quickActions: [
        { id: 1, icon: '📊', label: '健康报告', color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', action: 'health-report' },
        { id: 2, icon: '💊', label: '用药提醒', color: 'linear-gradient(135deg, #22c55e, #16a34a)', action: 'medication' },
        { id: 3, icon: '🎯', label: '健康目标', color: 'linear-gradient(135deg, #f59e0b, #d97706)', action: 'health-goals' },
        { id: 4, icon: '📱', label: '数据同步', color: 'linear-gradient(135deg, #8b5cf6, #7c2d12)', action: 'data-sync' }
      ],
      healthMenuItems: [
        { id: 1, icon: '📋', label: '健康档案', desc: '个人健康信息管理', path: '/pages/health-record/health-record' },
        { id: 2, icon: '🩺', label: '体检报告', desc: '查看历史体检数据', path: '/pages/medical-report/medical-report', badge: '3' },
        { id: 3, icon: '💉', label: '疫苗接种', desc: '疫苗接种记录', path: '/pages/vaccination/vaccination' },
        { id: 4, icon: '🏃', label: '运动记录', desc: '运动数据统计', path: '/pages/exercise/exercise' },
        { id: 5, icon: '😴', label: '睡眠分析', desc: '睡眠质量追踪', path: '/pages/sleep/sleep' }
      ],
      settingsMenuItems: [
        { id: 1, icon: '🔔', label: '消息通知', desc: '推送通知设置', path: '/pages/notifications/notifications' },
        { id: 2, icon: '🔒', label: '隐私安全', desc: '账户安全设置', path: '/pages/privacy/privacy' },
        { id: 3, icon: '🌙', label: '深色模式', desc: '主题显示设置', path: '/pages/theme/theme' },
        { id: 4, icon: '📱', label: '设备管理', desc: '绑定设备管理', path: '/pages/devices/devices', badge: '2' },
        { id: 5, icon: '☁️', label: '数据同步', desc: '云端数据同步', path: '/pages/sync/sync' }
      ],
      supportMenuItems: [
        { id: 1, icon: '❓', label: '常见问题', desc: 'FAQ答疑解惑', path: '/pages/faq/faq' },
        { id: 2, icon: '📞', label: '联系客服', desc: '7x24小时在线服务', path: '/pages/support/support' },
        { id: 3, icon: '💬', label: '意见反馈', desc: '提出宝贵建议', path: '/pages/feedback/feedback' },
        { id: 4, icon: '⭐', label: '给我们评分', desc: '应用商店评价', path: 'rate-app' },
        { id: 5, icon: '📄', label: '隐私政策', desc: '查看隐私条款', path: '/pages/privacy-policy/privacy-policy' }
      ]
    }
  },
  methods: {
    handleAction(action) {
      switch(action) {
        case 'health-report':
          uni.switchTab({
            url: '/pages/report/report'
          });
          break;
        case 'medication':
          uni.showToast({
            title: '跳转到用药提醒',
            icon: 'none'
          });
          break;
        case 'health-goals':
          uni.showToast({
            title: '设置健康目标',
            icon: 'none'
          });
          break;
        case 'data-sync':
          uni.showLoading({
            title: '同步中...'
          });
          setTimeout(() => {
            uni.hideLoading();
            uni.showToast({
              title: '同步完成',
              icon: 'success'
            });
          }, 2000);
          break;
      }
    },
    navigateTo(path) {
      if (path === 'rate-app') {
        uni.showToast({
          title: '跳转到应用商店',
          icon: 'none'
        });
        return;
      }
      
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    logout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            });
            // 这里可以添加退出登录的逻辑
          }
        }
      });
    }
  },
  onLoad() {
    console.log('Profile page loaded');
  }
}
</script>

<style lang="scss">
.profile-header {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  
  .avatar-img {
    width: 100%;
    height: 100%;
  }
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 600;
  color: white;
  display: block;
  margin-bottom: 4px;
}

.user-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 2px;
}

.user-id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  display: block;
}

.edit-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 18px;
}

.health-stats {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: white;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
  display: block;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.action-label {
  font-size: 12px;
  color: #374151;
  text-align: center;
}

.menu-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  padding: 16px 20px 8px;
  display: block;
}

.menu-items {
  .menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border: none;
    background: white;
    border-bottom: 1px solid #f3f4f6;
    text-align: left;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: #f9fafb;
    }
  }
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.menu-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.menu-text {
  flex: 1;
}

.menu-label {
  font-size: 14px;
  color: #1f2937;
  display: block;
}

.menu-desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  display: block;
}

.menu-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-badge {
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.menu-arrow {
  color: #9ca3af;
  font-size: 14px;
}

.membership-card {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 16px;
  padding: 20px;
  color: white;
}

.membership-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.membership-title {
  font-size: 18px;
  font-weight: 600;
}

.membership-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.membership-desc {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
  display: block;
}

.membership-benefits {
  margin-bottom: 16px;
  
  .benefit-item {
    font-size: 12px;
    opacity: 0.9;
    display: block;
    margin-bottom: 4px;
  }
}

.renew-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}

.version-info {
  text-align: center;
  padding: 16px;
  
  .app-name {
    font-size: 14px;
    color: #6b7280;
    display: block;
  }
  
  .build-info {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
    display: block;
  }
}

.logout-btn {
  width: 100%;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
}

// 复用之前的通用样式
.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.pb-20 {
  padding-bottom: 80px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.rounded-b-3xl {
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.p-6 {
  padding: 24px;
}

.text-white {
  color: white;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
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
</style>