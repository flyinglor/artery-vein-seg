<template>
  <view class="pb-20 space-y-4">
    <!-- Header -->
    <view class="header-gradient text-white p-6 rounded-b-3xl">
      <view class="flex justify-between items-start">
        <view>
          <text class="text-2xl mb-1">早上好！ 👋</text>
          <text class="text-blue-100">今天感觉怎么样？</text>
        </view>
      </view>
      
      <!-- Today's Summary -->
      <view class="mt-6 grid grid-cols-2 gap-4">
        <view class="summary-card">
          <view class="flex items-center gap-2 mb-2">
            <text class="icon">❤️</text>
            <text class="text-sm">健康评分</text>
          </view>
          <view class="text-2xl">87/100</view>
        </view>
        <view class="summary-card">
          <view class="flex items-center gap-2 mb-2">
            <text class="icon">📈</text>
            <text class="text-sm">本周趋势</text>
          </view>
          <view class="text-2xl">↗️ +2.3%</view>
        </view>
      </view>
    </view>

    <!-- Weekly Summary -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <view class="card-title">📅 本周总结</view>
          <view class="card-description">8月12日 - 8月18日</view>
        </view>
        <view class="card-content">
          <view class="grid grid-cols-2 gap-4">
            <view class="summary-stat bg-green-50">
              <view class="stat-header text-green-600">
                <text class="icon">📉</text>
                <text class="text-sm">体重变化</text>
              </view>
              <view class="text-xl text-green-700">-1.5kg</view>
              <view class="text-xs text-green-600">较上周</view>
            </view>
            <view class="summary-stat bg-blue-50">
              <view class="stat-header text-blue-600">
                <text class="icon">📈</text>
                <text class="text-sm">平均步数</text>
              </view>
              <view class="text-xl text-blue-700">9,200</view>
              <view class="text-xs text-blue-600">每天</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Quick Stats -->
    <view class="px-4">
      <view class="grid grid-cols-2 gap-3">
        <view class="stat-card">
          <view class="flex items-center justify-between mb-2">
            <text class="icon text-blue-500">⚖️</text>
            <text class="text-sm text-muted-foreground">体重</text>
          </view>
          <view class="text-xl">{{latestData.weight}}kg</view>
          <view class="text-xs text-green-600">本周-0.3kg</view>
        </view>

        <view class="stat-card">
          <view class="flex items-center justify-between mb-2">
            <text class="icon text-red-500">❤️</text>
            <text class="text-sm text-muted-foreground">血压</text>
          </view>
          <view class="text-xl">{{latestData.bloodPressure}}/80</view>
          <view class="text-xs text-green-600">正常</view>
        </view>

        <view class="stat-card">
          <view class="flex items-center justify-between mb-2">
            <text class="icon text-green-500">💓</text>
            <text class="text-sm text-muted-foreground">心率</text>
          </view>
          <view class="text-xl">{{latestData.heartRate}} bpm</view>
          <view class="text-xs text-muted-foreground">静息</view>
        </view>

        <view class="stat-card">
          <view class="flex items-center justify-between mb-2">
            <text class="icon text-blue-400">💧</text>
            <text class="text-sm text-muted-foreground">饮水</text>
          </view>
          <view class="text-xl">6/8</view>
          <view class="text-xs text-orange-600">还需2杯</view>
        </view>
      </view>
    </view>

    <!-- Weight Trend Chart -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <view class="card-title">体重趋势</view>
          <view class="card-description">过去7天</view>
        </view>
        <view class="card-content">
          <view class="chart-container">
            <!-- 简化的图表显示，实际项目中可使用u-charts等图表库 -->
            <view class="chart-placeholder">
              <text class="chart-text">体重趋势图表</text>
              <view class="chart-line">
                <view class="chart-point" v-for="(item, index) in healthData" :key="index">
                  <text class="text-xs">{{item.date}}</text>
                  <view class="point" :style="{ height: (item.weight - 70) * 3 + 'px' }"></view>
                  <text class="text-xs">{{item.weight}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Today's Medications -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <view class="flex items-center justify-between">
            <text class="card-title">💊 今日用药</text>
            <view class="badge-outline">1项待服用</view>
          </view>
        </view>
        <view class="card-content">
          <view class="space-y-3">
            <view class="medication-item" v-for="(med, index) in todaysMedications" :key="index">
              <view class="flex items-center gap-3">
                <view class="status-dot" :class="med.taken ? 'taken' : 'pending'"></view>
                <view>
                  <text class="medication-name" :class="{ 'line-through': med.taken }">{{med.name}}</text>
                  <text class="medication-time">{{med.time}}</text>
                </view>
              </view>
              <view class="badge" :class="med.taken ? 'taken-badge' : 'pending-badge'">
                {{med.taken ? '✓ 已服用' : '待服用'}}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Today's Goals -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <text class="card-title">🎯 今日目标</text>
        </view>
        <view class="card-content">
          <view class="space-y-4">
            <view class="goal-item" v-for="(goal, index) in quickGoals" :key="index">
              <view class="flex justify-between items-center">
                <text class="text-sm">{{goal.goal}}</text>
                <text class="text-sm text-muted-foreground">{{goal.progress}}%</text>
              </view>
              <view class="progress-bar">
                <view class="progress-fill" :style="{ width: goal.progress + '%' }"></view>
              </view>
              <text class="text-xs text-muted-foreground">{{goal.current}} / {{goal.target}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Health Insights -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <view class="card-title">💡 健康洞察</view>
          <view class="card-description">基于您的数据分析</view>
        </view>
        <view class="card-content">
          <view class="space-y-3">
            <view class="insight-item bg-green-50 border-green-200">
              <view class="insight-dot bg-green-500"></view>
              <view>
                <text class="insight-title text-green-800">体重下降趋势良好</text>
                <text class="insight-desc text-green-600">本周减重1.5kg，保持当前节奏可达成目标</text>
              </view>
            </view>
            
            <view class="insight-item bg-blue-50 border-blue-200">
              <view class="insight-dot bg-blue-500"></view>
              <view>
                <text class="insight-title text-blue-800">运动量有待提升</text>
                <text class="insight-desc text-blue-600">建议每日步数增加到10,000步以上</text>
              </view>
            </view>
            
            <view class="insight-item bg-purple-50 border-purple-200">
              <view class="insight-dot bg-purple-500"></view>
              <view>
                <text class="insight-title text-purple-800">心率数据稳定</text>
                <text class="insight-desc text-purple-600">静息心率保持在正常范围内</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Monthly Comparison -->
    <view class="px-4">
      <view class="card">
        <view class="card-header">
          <view class="card-title">月度对比</view>
          <view class="card-description">近三个月健康数据对比</view>
        </view>
        <view class="card-content">
          <view class="space-y-4">
            <view class="monthly-stat" v-for="(stat, index) in monthlyStats" :key="index">
              <view>
                <text class="month-title">{{stat.month}}</text>
                <text class="month-desc">平均体重: {{stat.avgWeight}}kg</text>
              </view>
              <view class="text-right">
                <text class="month-data">步数: {{stat.avgSteps.toLocaleString()}}</text>
                <text class="month-desc">运动: {{stat.workoutDays}}天</text>
              </view>
            </view>
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
      healthData: [
        { date: '8/12', weight: 75, bloodPressure: 120, heartRate: 72, steps: 8500, mood: 4 },
        { date: '8/13', weight: 74.8, bloodPressure: 118, heartRate: 70, steps: 9200, mood: 4 },
        { date: '8/14', weight: 74.5, bloodPressure: 122, heartRate: 75, steps: 7800, mood: 3 },
        { date: '8/15', weight: 74.2, bloodPressure: 119, heartRate: 73, steps: 10200, mood: 4 },
        { date: '8/16', weight: 74.0, bloodPressure: 121, heartRate: 71, steps: 9800, mood: 5 },
        { date: '8/17', weight: 73.8, bloodPressure: 117, heartRate: 69, steps: 11000, mood: 5 },
        { date: '8/18', weight: 73.5, bloodPressure: 120, heartRate: 72, steps: 8900, mood: 4 }
      ],
      todaysMedications: [
        { name: "维生素D", time: "08:00", taken: true },
        { name: "欧米伽3", time: "12:00", taken: true },
        { name: "复合维生素", time: "20:00", taken: false }
      ],
      quickGoals: [
        { goal: "每日步数", progress: 85, current: "8,500", target: "10,000" },
        { goal: "饮水量", progress: 75, current: "6", target: "8杯" },
        { goal: "减重目标", progress: 60, current: "-2kg", target: "-5kg" }
      ],
      monthlyStats: [
        { month: '6月', avgWeight: 76.2, avgSteps: 8200, workoutDays: 12 },
        { month: '7月', avgWeight: 75.1, avgSteps: 8800, workoutDays: 15 },
        { month: '8月', avgWeight: 74.2, avgSteps: 9200, workoutDays: 18 }
      ]
    }
  },
  computed: {
    latestData() {
      return this.healthData[this.healthData.length - 1];
    }
  },
  onLoad() {
    console.log('Dashboard loaded');
  }
}
</script>
<style lang="scss">
.header-gradient {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
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

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: 1fr 1fr;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.px-4 {
  padding-left: 16px;
  padding-right: 16px;
}

.space-y-3 > * + * {
  margin-top: 12px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.medication-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.status-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  
  &.taken {
    background: #22c55e;
  }
  
  &.pending {
    background: #d1d5db;
  }
}

.medication-name {
  font-size: 14px;
  display: block;
  
  &.line-through {
    text-decoration: line-through;
    color: #6b7280;
  }
}

.medication-time {
  font-size: 12px;
  color: #6b7280;
  display: block;
}

.badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  
  &.taken-badge {
    background: #dcfce7;
    color: #16a34a;
  }
  
  &.pending-badge {
    background: #f3f4f6;
    color: #374151;
  }
}

.goal-item {
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

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid;
}

.insight-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}

.insight-title {
  font-size: 14px;
  display: block;
}

.insight-desc {
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.monthly-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.month-title {
  font-weight: 500;
  display: block;
}

.month-desc {
  font-size: 14px;
  color: #6b7280;
  display: block;
}

.month-data {
  font-size: 14px;
  display: block;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
}

.chart-text {
  color: #6b7280;
  font-size: 16px;
}

.chart-line {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-top: 16px;
  gap: 8px;
}

.chart-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  
  .point {
    width: 4px;
    background: #8b5cf6;
    border-radius: 2px;
    min-height: 10px;
  }
}

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
</style>
