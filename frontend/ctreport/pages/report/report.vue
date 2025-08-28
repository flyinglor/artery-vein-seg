<template>
  <view class="pb-20 space-y-4">
    <!-- Header -->
    <view class="report-header text-white p-6 rounded-b-3xl ">
      <view class="flex justify-between items-start">
        <view>
          <view class="text-2xl mb-1">健康报告 📊</view>
          <view class="text-green-100">查看您的健康指数分析</view>
        </view>
        <view class="flex gap-2">
          <button class="back-btn">📤</button>
          <button class="back-btn">⬇️</button>
        </view>
      </view>
      
      <!-- Period Selector -->
      <view class="mt-6 flex gap-2">
        <button class="period-btn active">本周</button>
        <button class="period-btn">本月</button>
        <button class="period-btn">三个月</button>
      </view>
    </view>

    <!-- Overall Health Score -->
    <view class="px-4">
      <view class="overall-score-card">
        <view class="text-center">
          <text class="score-title">📊 综合健康评分</text>
          <text class="score-value">84.5</text>
          <text class="score-desc">比上月提升 +3.2 分</text>
        </view>
        <view class="chart-placeholder">
          <!-- <text class="chart-label">健康指数分布图</text> -->
			<view class="chart-placeholder">
			  <view class="pie-chart"></view>
			</view>
        </view>
      </view>
    </view>

    <!-- Health Indices -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <view class="card-title">❤️ 健康指数详情</view>
          <view class="card-description">各项健康指标的详细分析</view>
        </view>
        <view class="card-content">
          <view class="space-y-4">
            <view class="health-index-item" v-for="(index, idx) in healthIndices" :key="idx" @click="toggleIndex(idx)">
              <view class="index-header">
                <view class="flex items-center gap-3">
                  <view class="index-icon" :style="{ background: index.gradient }">
                    <text>{{index.iconText}}</text>
                  </view>
                  <view>
                    <text class="index-name">{{index.name}}</text>
                    <text class="index-desc">{{index.description}}</text>
                  </view>
                </view>
                <view class="text-right">
                  <text class="index-value">{{index.value}}</text>
                  <view class="flex items-center gap-2">
                    <view class="status-badge" :class="index.statusClass">{{index.status}}</view>
                    <text class="trend-text">+{{index.trend}}</text>
                  </view>
                </view>
              </view>
              
              <view class="progress-section">
                <view class="flex justify-between items-center text-sm">
                  <text>健康指数</text>
                  <text>{{index.value}}/100</text>
                </view>
                <view class="progress-bar">
                  <view class="progress-fill" :style="{ width: index.value + '%' }"></view>
                </view>
              </view>

              <view class="index-details" v-if="selectedIndex === idx">
                <text class="details-title">详细指标：</text>
                <view class="details-list">
                  <view class="detail-item" v-for="(detail, detailIdx) in index.details" :key="detailIdx">
                    <text class="detail-label">{{detail.label}}</text>
                    <view class="detail-value">
                      <text>{{detail.value}}</text>
                      <view class="detail-status">{{detail.status}}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Medical Imaging Reports -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <view class="card-title">🔬 影像报告</view>
          <view class="card-description">医学影像检查报告</view>
        </view>
        <view class="card-content">
          <view class="space-y-4">
            <button class="imaging-report-btn" v-for="(report, index) in imagingReports" :key="report.type" @click="navigateToImaging(report.type)">
              <view class="flex items-center justify-between">
                <view class="flex items-center gap-4">
                  <view class="report-icon" :style="{ background: report.gradient }">
                    <text>{{report.iconText}}</text>
                  </view>
                  <view class="flex flex-col">
                    <view class="report-label">{{report.label}}</view>
                    <!-- <view class="report-desc">{{report.description}}</view> -->
                  </view>
                </view>
                <view class="report-count" :class="report.bgColor + ' ' + report.textColor">
                  {{report.count}}份报告
                </view>
              </view>
            </button>
          </view>
        </view>
      </view>
    </view>

	<!-- Health Trends -->
	<view class="px-4">
	  <view class="card">
		<view class="card-header">
		  <view class="card-title">📈 健康趋势分析</view>
		  <view class="card-description">过去30天的健康指数变化</view>
		</view>
		<view class="card-content">
		  <view class="trend-chart">
			<!-- X/Y axis grid -->
			<view class="chart-grid"></view>

			<!-- Fake trend lines -->
			<view class="trend-line heart-line"></view>
			<view class="trend-line lung-line"></view>
			<view class="trend-line metabolism-line"></view>
			<view class="trend-line sleep-line"></view>
		  </view>

		  <!-- Legend -->
		  <view class="chart-legend">
			<text class="legend-item heart-text">● 心脏</text>
			<text class="legend-item lung-text">● 肺部</text>
			<text class="legend-item metabolism-text">● 代谢</text>
			<text class="legend-item sleep-text">● 睡眠</text>
		  </view>
		</view>
	  </view>
	</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedIndex: null,
      healthIndices: [
        {
          name: "心脏健康指数",
          value: 87,
          description: "基于心率、血压等数据",
          iconText: "❤️",
          gradient: "linear-gradient(135deg, #ef4444, #ec4899)",
          status: "优秀",
          statusClass: "status-excellent",
          trend: "2",
          details: [
            { label: "静息心率", value: "72 bpm", status: "正常" },
            { label: "血压", value: "120/80", status: "理想" },
            { label: "心率变异性", value: "良好", status: "正常" }
          ]
        },
        {
          name: "肺健康指数",
          value: 82,
          description: "基于呼吸频率、血氧等",
          iconText: "🫁",
          gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          status: "良好",
          statusClass: "status-good",
          trend: "1",
          details: [
            { label: "血氧饱和度", value: "98%", status: "正常" },
            { label: "呼吸频率", value: "16/分钟", status: "正常" },
            { label: "肺部动静脉数量比", value: "良好", status: "正常" },
			{ label: "肺部血管粗细情况", value: "过粗", status: "异常" },
			{ label: "肺部血管分支连接性与分支长度", value: "良好", status: "正常" },
          ]
        },
        {
          name: "新陈代谢指数",
          value: 75,
          description: "基于体重、活动量等",
          iconText: "🔥",
          gradient: "linear-gradient(135deg, #f97316, #ef4444)",
          status: "中等",
          statusClass: "status-medium",
          trend: "5",
          details: [
            { label: "基础代谢", value: "1680 kcal", status: "正常" },
            { label: "体脂率", value: "18%", status: "理想" },
            { label: "肌肉量", value: "62kg", status: "良好" }
          ]
        },
        {
          name: "睡眠质量指数",
          value: 90,
          description: "基于睡眠时长、深度等",
          iconText: "😴",
          gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
          status: "优秀",
          statusClass: "status-excellent",
          trend: "3",
          details: [
            { label: "睡眠时长", value: "7.5小时", status: "理想" },
            { label: "深度睡眠", value: "25%", status: "良好" },
            { label: "入睡时间", value: "8分钟", status: "正常" }
          ]
        },
        {
          name: "运动活力指数",
          value: 78,
          description: "基于日常活动、运动强度",
          iconText: "⚡",
          gradient: "linear-gradient(135deg, #22c55e, #10b981)",
          status: "良好",
          statusClass: "status-good",
          trend: "4",
          details: [
            { label: "日均步数", value: "9,200步", status: "良好" },
            { label: "活跃时间", value: "45分钟", status: "正常" },
            { label: "卡路里消耗", value: "420 kcal", status: "良好" }
          ]
        },
        {
          name: "免疫力指数",
          value: 85,
          description: "基于营养、作息等综合评估",
          iconText: "🛡️",
          gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
          status: "优秀",
          statusClass: "status-excellent",
          trend: "2",
          details: [
            { label: "白细胞计数", value: "正常", status: "正常" },
            { label: "维生素D", value: "充足", status: "理想" },
            { label: "压力水平", value: "低", status: "良好" }
          ]
        }
      ],
      imagingReports: [
        { 
          type: 'CT', 
          iconText: '🩻',
          label: 'CT影像报告', 
          description: '计算机断层扫描',
          count: 3,
          gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700'
        },
        { 
          type: 'MRI', 
          iconText: '🧠',
          label: '磁共振', 
          description: '核磁共振成像',
          count: 2,
          gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700'
        },
        { 
          type: 'ULTRASOUND', 
          iconText: '🌊',
          label: 'B超', 
          description: '超声波检查',
          count: 5,
          gradient: 'linear-gradient(135deg, #22c55e, #14b8a6)',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700'
        }
      ]
    }
  },
  methods: {
    toggleIndex(idx) {
      this.selectedIndex = this.selectedIndex === idx ? null : idx;
    },
    navigateToImaging(type) {
      if (type === 'CT') {
        uni.navigateTo({
          url: '/pages/ct-report/ct-report'
        });
      }
      // 可以为其他类型添加更多导航
    }
  },
  onLoad() {
    console.log('Report page loaded');
  }
}
</script>

<style lang="scss">
.report-header {
  background: linear-gradient(to right, #22c55e, #14b8a6);
  border-radius: 20px;
}

.period-btn {
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  background: transparent;
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
  }
}

.overall-score-card {
  background: linear-gradient(135deg, #eef2ff, #f3e8ff);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-direction: column; /* vertical layout */
  align-items: center;    /* horizontal center */
  justify-content: center; /* vertical center if parent has height */
  text-align: center;
}

.score-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.score-value {
  font-size: 36px;
  font-weight: bold;
  color: #4f46e5;
  display: block;
  margin: 8px 0;
}

.score-desc {
  font-size: 14px;
  color: #6b7280;
  display: block;
}

.pie-chart-mock {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
}

.pie-segment {
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  color: white;
  text-align: center;
  
  &.heart { background: #ef4444; }
  &.lung { background: #3b82f6; }
  &.metabolism { background: #f97316; }
  &.sleep { background: #8b5cf6; }
  &.exercise { background: #22c55e; }
  &.immunity { background: #06b6d4; }
}

.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    #ff6b6b 0% 24%,   /* 心脏 87 */
    #4ecdc4 24% 45%,  /* 肺部 82 */
    #ffe66d 45% 64%,  /* 代谢 75 */
    #1a535c 64% 85%,  /* 睡眠 90 */
    #5c7aea 85% 95%,  /* 运动 78 */
    #ff9f1c 95% 100%  /* 免疫 85 */
  );
  margin-top: 15px;
}


.health-index-item {
  padding: 3px 3px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.index-header {
  display: flex;
  items-center: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.index-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
}

.index-name {
  font-weight: 500;
  display: block;
}

.index-desc {
  font-size: 14px;
  color: #6b7280;
  margin-top: 2px;
  display: block;
}

.index-value {
  font-size: 24px;
  font-weight: bold;
  display: block;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  
  &.status-excellent {
    background: #22c55e;
    color: white;
  }
  
  &.status-good {
    background: #3b82f6;
    color: white;
  }
  
  &.status-medium {
    background: #eab308;
    color: white;
  }
}

.trend-text {
  font-size: 12px;
  color: #22c55e;
}

.progress-section {
  margin-bottom: 12px;
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    margin: 8px 0;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: #3b82f6;
      transition: width 0.3s ease;
    }
  }
}

.index-details {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
  margin-top: 12px;
}

.details-title {
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
}

.details-list {
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .detail-label {
      color: #6b7280;
      font-size: 14px;
    }
    
    .detail-value {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .detail-status {
        padding: 2px 6px;
        background: #f0fdf4;
        color: #16a34a;
        border: 1px solid #bbf7d0;
        border-radius: 6px;
        font-size: 12px;
      }
    }
  }
}
.back-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.imaging-report-btn {
  width: 100%;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.report-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right:12px;
}

.report-label {
  font-weight: 500;
  display: block;
}

.report-desc {
  font-size: 14px;
  color: #6b7280;
  margin-top: 2px;
  display: block;
}

.report-count {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.bg-blue-50 {
  background: #eff6ff;
}

.bg-purple-50 {
  background: #faf5ff;
}

.bg-green-50 {
  background: #f0fdf4;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-purple-700 {
  color: #7c2d12;
}

.text-green-700 {
  color: #15803d;
}

.chart-placeholder-text {
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 16px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.trend-chart {
  position: relative;
  height: 200rpx;
  width: 100%;
  margin-top: 16rpx;
  border: 1px solid #eee;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fafafa;
}

/* Faint grid background */
.chart-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, #ddd 1px, transparent 1px),
    linear-gradient(to bottom, #ddd 1px, transparent 1px);
  background-size: 40rpx 40rpx;
  opacity: 0.4;
}

/* Fake slanted lines for mock effect */
.trend-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
}

.heart-line {
  border-top: 2px solid #ff6b6b;
  transform: translateY(-60rpx) rotate(-10deg);
}
.lung-line {
  border-top: 2px solid #4ecdc4;
  transform: translateY(-100rpx) rotate(5deg);
}
.metabolism-line {
  border-top: 2px solid #ffe66d;
  transform: translateY(-140rpx) rotate(15deg);
}
.sleep-line {
  border-top: 2px solid #5c7aea;
  transform: translateY(-40rpx) rotate(-5deg);
}

/* Legend */
.chart-legend {
  margin-top: 12rpx;
  display: flex;
  justify-content: space-around;
}

.legend-item {
  font-size: 24rpx;
}

.heart-text { color: #ff6b6b; }
.lung-text { color: #4ecdc4; }
.metabolism-text { color: #e0b000; }
.sleep-text { color: #5c7aea; }


.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 14px;
}

.text-xl {
  font-size: 20px;
}

.text-2xl {
  font-size: 24px;
}

.text-muted-foreground {
  color: #6b7280;
}

.text-green-600 {
  color: #16a34a;
}

.text-green-700 {
  color: #15803d;
}

.text-green-800 {
  color: #166534;
}

.text-blue-600 {
  color: #2563eb;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-blue-800 {
  color: #1e40af;
}

.text-purple-600 {
  color: #9333ea;
}

.text-purple-700 {
  color: #7c2d12;
}

.text-purple-800 {
  color: #6b21a8;
}

.text-orange-600 {
  color: #ea580c;
}

.bg-green-50 {
  background: #f0fdf4;
}

.bg-blue-50 {
  background: #eff6ff;
}

.bg-purple-50 {
  background: #faf5ff;
}

.bg-green-500 {
  background: #22c55e;
}

.bg-blue-500 {
  background: #3b82f6;
}

.bg-purple-500 {
  background: #a855f7;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

.border-purple-200 {
  border-color: #e9d5ff;
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

.mb-2 {
  margin-bottom: 8px;
}

.mt-6 {
  margin-top: 24px;
}

.p-6 {
  padding: 24px;
}

.pb-20 {
  padding-bottom: 80px;
}

.rounded-b-3xl {
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}

.icon {
  font-size: 16px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.card-description {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.card-content {
  padding: 16px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-stat {
  text-align: center;
  padding: 12px;
  border-radius: 12px;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
}

</style>