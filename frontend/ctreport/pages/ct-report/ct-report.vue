<template>
  <view class="ct-report-page">
    <!-- Header with Back Button -->
    <view class="ct-header text-white px-4 py-2">
      <view class="flex items-center justify-center relative w-full px-4 py-2">
       <!-- Back button -->
       <button class="back-btn absolute left-4 top-1-2 -translate-y-1-2" @click="goBack">
         <text class="text-xl">←</text>
       </button>
     
       <!-- Title & subtitle -->
       <view class="flex flex-col items-center text-center">
         <text class="text-2xl font-bold">CT影像报告</text>
         <text class="text-blue-100 text-sm mt-1">计算机断层扫描分析</text>
       </view>
      </view>

      <!-- Progress Indicator -->
      <view class="progress-steps">
        <view class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <view class="step-circle">1</view>
          <text class="step-text">上传影像</text>
        </view>
        <view class="step-line" :class="{ active: currentStep > 1 }"></view>
        <view class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <view class="step-circle">2</view>
          <text class="step-text">AI分析</text>
        </view>
        <view class="step-line" :class="{ active: currentStep > 2 }"></view>
        <view class="step" :class="{ active: currentStep >= 3 }">
          <view class="step-circle">3</view>
          <text class="step-text">查看报告</text>
        </view>
      </view>
    </view>
	
	
	<!-- <view style="width: 90%;height: 70vh;background: rgba(0,0,0,0); margin: auto;  padding: 10px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); transform: translate(0.05);" v-if="options">
		<Preview3D @loaded="loaded" ref="preview" v-bind="options">
		</Preview3D>
	</view>
	<view>
		<button @click="play" class="mini-btn" size="mini" type="warn">播放动画</button>
		<button @click="heart"class="mini-btn" size="mini" type="primary">心脏</button>
		<button @click="lung" class="mini-btn" size="mini" type="primary">肺部血管</button>
		<button @click="brain" class="mini-btn" size="mini" type="primary">大脑</button>
		<button @click="change" class="mini-btn" size="mini" type="primary">切换</button>
		<button @click="rotate" class="mini-btn" size="mini" type="primary">旋转</button>
	</view> -->
	
    <view class="page-content">
      <!-- Step 1: Image Upload -->
      <view v-if="currentStep === 1" class="upload-section">
        <view class="card">
          <view class="card-header">
            <text class="card-title">📤 上传CT影像</text>
            <text class="card-desc">支持DICOM、NPZ、JPG、PNG格式，单个文件不超过100MB</text>
          </view>
          <view class="card-content">
            <!-- Upload Area -->
            <view class="upload-area" @click="selectFiles">
              <view class="upload-icon">📁</view>
              <text class="upload-text">点击选择文件或拖拽到此处</text>
              <text class="upload-hint">支持多文件同时上传</text>
            </view>
            
            <!-- File List -->
            <view v-if="uploadedFiles.length > 0" class="file-list">
              <text class="file-list-title">已选择文件 ({{uploadedFiles.length}})</text>
              <view class="file-item" v-for="(file, index) in uploadedFiles" :key="index">
                <view class="file-info">
                  <text class="file-icon">🗂️</text>
                  <view class="file-details">
                    <text class="file-name">{{file.name}}</text>
                    <text class="file-size">{{formatFileSize(file.size)}}</text>
                  </view>
                </view>
                <view class="file-status">
                  <view v-if="file.status === 'uploading'" class="uploading">
                    <!-- <text class="upload-progress">{{file.progress}}%</text> -->
                  </view>
                  <view v-else-if="file.status === 'completed'" class="completed">
                    <text class="success-icon">✓</text>
                  </view>
                  <button v-else class="remove-btn" @click="removeFile(index)">
                    <text>✕</text>
                  </button>
                </view>
              </view>
            </view>
            
            <!-- Upload Button -->
            <button 
              v-if="uploadedFiles.length > 0 && !isUploading" 
              class="upload-btn"
              @click="startUpload"
            >
              开始上传分析
            </button>
            
            <button 
              v-if="isUploading" 
              class="upload-btn uploading" 
              disabled
            >
              上传中... {{Math.round(overallProgress)}}%
            </button>
          </view>
        </view>

        <!-- Recent Scans -->
        <view class="card">
          <view class="card-header">
            <text class="card-title">📋 最近的扫描</text>
            <text class="card-desc">选择之前上传的影像进行重新分析</text>
          </view>
          <view class="card-content">
            <view class="recent-scans">
              <view class="scan-item" v-for="scan in recentScans" :key="scan.id" @click="selectRecentScan(scan)">
                <image :src="scan.thumbnail" class="scan-thumbnail" mode="aspectFill" />
                <view class="scan-info">
                  <text class="scan-title">{{scan.title}}</text>
                  <text class="scan-date">{{scan.date}}</text>
                  <text class="scan-status">{{scan.status}}</text>
                </view>
                <text class="scan-arrow">→</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Step 2: AI Analysis -->
      <view v-if="currentStep === 2" class="analysis-section">
        <view class="card">
          <view class="card-header">
            <text class="card-title">🤖 AI智能分析中</text>
            <text class="card-desc">正在使用深度学习算法分析您的CT影像</text>
          </view>
          <view class="card-content">
            <!-- Analysis Progress -->
            <view class="analysis-progress">
              <view class="progress-ring">
                <text class="progress-text">{{Math.round(analysisProgress)}}%</text>
              </view>
              <text class="analysis-stage">{{currentAnalysisStage}}</text>
            </view>
            
            <!-- Analysis Steps -->
            <view class="analysis-steps">
              <view class="analysis-step" v-for="step in analysisSteps" :key="step.id" :class="{ active: step.active, completed: step.completed }">
                <view class="step-icon">{{step.icon}}</view>
                <view class="step-content">
                  <text class="step-name">{{step.name}}</text>
                  <text class="step-desc">{{step.description}}</text>
                </view>
                <view class="step-status">
                  <text v-if="step.completed" class="completed-icon">✓</text>
                  <view v-else-if="step.active" class="loading-spinner"></view>
                </view>
              </view>
            </view>
            
            <!-- Cancel Button -->
            <button class="cancel-btn" @click="cancelAnalysis">
              取消分析
            </button>
          </view>
        </view>

        <!-- Preview Images -->
        <view class="card">
          <view class="card-header">
            <text class="card-title">🖼️ 影像预览</text>
          </view>
          <view class="card-content">
            <view class="image-preview-grid">
              <view class="preview-item" v-for="(image, index) in previewImages" :key="index">
                <image :src="image.url" class="preview-image" mode="aspectFill" />
                <text class="preview-label">{{image.label}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Step 3: Report Results -->
      <view v-if="currentStep === 3" class="results-section">
        <!-- AI Analysis Summary -->
        <view class="card">
          <view class="card-header">
            <text class="card-title">🎯 AI分析摘要</text>
            <view class="analysis-score" :class="getScoreClass(analysisResults.overallScore)">
              <text class="score-value">{{analysisResults.overallScore}}</text>
              <text class="score-label">总体评分</text>
            </view>
          </view>
          <view class="card-content">
            <view class="summary-grid">
              <view class="summary-item" v-for="item in analysisResults.summary" :key="item.key">
                <text class="summary-label">{{item.label}}</text>
                <text class="summary-value" :class="item.status">{{item.value}}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 3D Model Viewer -->
        <view class="card">
          <view class="card-header">
            <text class="card-title">🎮 3D模型查看</text>
            <text class="card-desc">旋转和缩放查看三维重建模型</text>
			<!-- 模型显示区域 -->

			<!-- 功能区 -->
          </view>
          <view class="card-content">
            <view class="model-viewer">
              <view class="model-placeholder">
				<view style="width: 90%; height: 70vh;background: rgba(0,0,0,0); margin: auto;  padding: 10px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); transform: translate(0.05);" v-if="options">
					<Preview3D @loaded="loaded" ref="preview" v-bind="options">
					</Preview3D>
				</view>
              </view>
              <view class="model-controls">
                <button class="control-btn" @click="resetView">重置视角</button>
                <button class="control-btn" @click="toggleWireframe">动静脉分割</button>
				<button class="control-btn" @click="toggleWireframe">异常标注</button>
                <button class="control-btn" @click="takeScreenshot">保存</button>
              </view>
            </view>
          </view>
        </view>

        <!-- Detailed Findings -->
        <view class="card">
          <view class="card-header">
            <text class="card-title">🔍 详细发现</text>
            <text class="card-desc">AI识别的具体影像特征和建议</text>
          </view>
          <view class="card-content">
            <view class="findings-list">
              <view class="finding-item" v-for="finding in analysisResults.findings" :key="finding.id">
                <view class="finding-header">
                  <text class="finding-title">{{finding.title}}</text>
                  <view class="finding-severity" :class="finding.severity">
                    {{getSeverityText(finding.severity)}}
                  </view>
                </view>
                <text class="finding-description">{{finding.description}}</text>
                <view v-if="finding.location" class="finding-location">
                  <text class="location-label">位置：</text>
                  <text class="location-value">{{finding.location}}</text>
                </view>
                <view v-if="finding.recommendation" class="finding-recommendation">
                  <text class="recommendation-label">建议：</text>
                  <text class="recommendation-value">{{finding.recommendation}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- Report Actions -->
        <view class="card">
          <view class="card-header">
            <text class="card-title">📄 报告操作</text>
          </view>
          <view class="card-content">
            <view class="action-buttons">
              <button class="action-btn primary" @click="exportReport">
                <text class="btn-icon">📥</text>
                <text class="btn-text">导出PDF报告</text>
              </button>
              <button class="action-btn secondary" @click="shareReport">
                <text class="btn-icon">📤</text>
                <text class="btn-text">分享给医生</text>
              </button>
              <button class="action-btn secondary" @click="saveToCloud">
                <text class="btn-icon">☁️</text>
                <text class="btn-text">保存到云端</text>
              </button>
              <button class="action-btn secondary" @click="scheduleFollowup">
                <text class="btn-icon">📅</text>
                <text class="btn-text">安排复查</text>
              </button>
            </view>
          </view>
        </view>

        <!-- Start New Analysis -->
        <view class="card">
          <view class="card-content">
            <button class="new-analysis-btn" @click="startNewAnalysis">
              🔄 开始新的分析
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Preview3D from '@/components/threeJs/preview3D.vue'

export function fetchLocal(url, data) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(new Response(xhr.responseText, {status: xhr.status}));
    };
    xhr.onerror = function() {
      reject(new TypeError('Local request failed'));
    };
    xhr.open('GET', url);
    xhr.send(data);
  });
}

export default {
  components: {
    Preview3D
  },
  data() {
    return {
      options: null,
      currentStep: 1,
      uploadedFiles: [],
      isUploading: false,
      overallProgress: 0,
      analysisProgress: 0,
      currentAnalysisStage: '准备分析...',
      recentScans: [
        {
          id: 1,
          title: '胸部CT扫描',
          date: '2025-08-15',
          status: '已完成分析',
          thumbnail: '/static/images/ct-thumb-1.jpg'
        },
        {
          id: 2,
          title: '腹部CT扫描',
          date: '2025-08-10',
          status: '已完成分析',
          thumbnail: '/static/images/ct-thumb-2.jpg'
        },
        {
          id: 3,
          title: '头部CT扫描',
          date: '2025-08-05',
          status: '分析中',
          thumbnail: '/static/images/ct-thumb-3.jpg'
        }
      ],
      analysisSteps: [
        {
          id: 1,
          name: '影像预处理',
          description: '图像去噪和标准化',
          icon: '🔧',
          active: false,
          completed: false
        },
        {
          id: 2,
          name: '特征提取',
          description: '识别关键解剖结构',
          icon: '🎯',
          active: false,
          completed: false
        },
        {
          id: 3,
          name: '异常检测',
          description: 'AI模型分析异常区域',
          icon: '🔍',
          active: false,
          completed: false
        },
        {
          id: 4,
          name: '3D重建',
          description: '生成三维模型',
          icon: '🎮',
          active: false,
          completed: false
        },
        {
          id: 5,
          name: '报告生成',
          description: '生成分析报告',
          icon: '📋',
          active: false,
          completed: false
        }
      ],
      previewImages: [
        { url: '/static/images/ct-preview-1.jpg', label: '轴位图像' },
        { url: '/static/images/ct-preview-2.jpg', label: '冠状位图像' },
        { url: '/static/images/ct-preview-3.jpg', label: '矢状位图像' },
        { url: '/static/images/ct-preview-4.jpg', label: '3D重建' }
      ],
      analysisResults: {
        overallScore: 85,
        summary: [
          { label: '图像质量', value: '优秀', status: 'good', key: 'quality' },
          { label: '扫描完整性', value: '完整', status: 'good', key: 'completeness' },
          { label: '发现异常', value: '2处', status: 'warning', key: 'abnormalities' },
          { label: '建议复查', value: '3个月后', status: 'info', key: 'followup' }
        ],
        findings: [
          {
            id: 1,
            title: '肺部小结节',
            description: '在右肺上叶发现直径约5mm的小结节，边界清晰，密度均匀。',
            location: '右肺上叶前段',
            severity: 'low',
            recommendation: '建议3个月后复查CT，观察结节变化情况。'
          },
          {
            id: 2,
            title: '轻度肺气肿',
            description: '双肺下叶可见轻度肺气肿改变，肺泡壁破坏轻微。',
            location: '双肺下叶',
            severity: 'medium',
            recommendation: '建议戒烟，定期复查，必要时肺功能检测。'
          }
        ]
      }
    }
  },
  mounted() {
    // 初始化数据
    this.options = {
      modelurl: "/static/model/lungv.glb",
	  // env: null,
      env: this.$getUrl("/studio_small_09_1k.hdr"),
      scale: .6,
      backgroundVisible: false,
      autoRotate: false,
      autoRotateSpeed: 5.0,
      isFixFbxMaterial: false,
    }
    // uni.showLoading({
    //   title: '加载中'
    // })
  },
  methods: {
    change() {
      uni.showLoading({
        title: '加载中'
      })
      let def = this.$getUrl("/RobotExpressive.glb")
      let isDef = this.options.modelurl === def
      this.options.modelurl = this.$getUrl(isDef ? "/DamagedHelmet.gltf.glb" : def)
    },
    heart() {
      this.options.modelurl = "/static/model/vessel.glb"
    },
    lung() {
      this.options.modelurl = "/static/model/lungv.glb"
    },
    brain() {
      this.options.modelurl = "/static/model/vessel.glb"
    },
    rotate() {
      this.options.autoRotate = !this.options.autoRotate
    },
    loaded() {
      uni.hideLoading()
      console.log("模型加载完毕")
    },
    play() {
      this.$refs.preview.play('Idle', false, {
        isReset: true,
      })
    },
    // goBack() {
    //   this.$emit('back');
    // },
	goBack() {
	  uni.navigateBack({
		delta: 1 // go back 1 page
	  });
	},
    selectFiles() {
      uni.chooseImage({
        count: 5,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          res.tempFilePaths.forEach((path, index) => {
            this.uploadedFiles.push({
              name: `CT_Image_${Date.now()}_${index}.dcm`,
              size: Math.random() * 10000000 + 1000000,
              path: path,
              status: 'ready',
              progress: 0
            });
          });
        }
      })
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    startUpload() {
      this.isUploading = true;
      this.overallProgress = 0;
      
      const uploadInterval = setInterval(() => {
        this.overallProgress += Math.random() * 10;
        
        this.uploadedFiles.forEach(file => {
          if (file.status === 'ready') {
            file.status = 'uploading';
          }
          if (file.status === 'uploading') {
            file.progress = Math.min(100, file.progress + Math.random() * 15);
            if (file.progress >= 100) {
              file.status = 'completed';
            }
          }
        });
        
        if (this.overallProgress >= 100) {
          clearInterval(uploadInterval);
          this.isUploading = false;
          this.overallProgress = 100;
          setTimeout(() => {
            this.startAnalysis();
          }, 1000);
        }
      }, 500);
    },
    startAnalysis() {
      this.currentStep = 2;
      this.analysisProgress = 0;
      
      const analysisInterval = setInterval(() => {
        this.analysisProgress += Math.random() * 3;
        
        const currentStepIndex = Math.floor(this.analysisProgress / 20);
        this.analysisSteps.forEach((step, index) => {
          if (index < currentStepIndex) {
            step.completed = true;
            step.active = false;
          } else if (index === currentStepIndex) {
            step.active = true;
            step.completed = false;
          } else {
            step.active = false;
            step.completed = false;
          }
        });
        
        if (this.analysisProgress < 20) {
          this.currentAnalysisStage = '影像预处理中...';
        } else if (this.analysisProgress < 40) {
          this.currentAnalysisStage = '特征提取中...';
        } else if (this.analysisProgress < 60) {
          this.currentAnalysisStage = '异常检测中...';
        } else if (this.analysisProgress < 80) {
          this.currentAnalysisStage = '3D重建中...';
        } else if (this.analysisProgress < 100) {
          this.currentAnalysisStage = '生成报告中...';
        }
        
        if (this.analysisProgress >= 100) {
          clearInterval(analysisInterval);
          this.analysisProgress = 100;
          this.currentAnalysisStage = '分析完成！';
          
          this.analysisSteps.forEach(step => {
            step.completed = true;
            step.active = false;
          });
          
          setTimeout(() => {
            this.currentStep = 3;
          }, 1500);
        }
      }, 300);
    },
    cancelAnalysis() {
      uni.showModal({
        title: '确认取消',
        content: '确定要取消当前分析吗？已上传的文件将保留。',
        success: (res) => {
          if (res.confirm) {
            this.currentStep = 1;
            this.analysisProgress = 0;
            this.analysisSteps.forEach(step => {
              step.active = false;
              step.completed = false;
            });
          }
        }
      })
    },
    selectRecentScan(scan) {
      uni.showModal({
        title: '使用历史扫描',
        content: `是否使用"${scan.title}"进行新的分析？`,
        success: (res) => {
          if (res.confirm) {
            this.startAnalysis();
          }
        }
      })
    },
    getScoreClass(score) {
      if (score >= 80) return 'score-excellent';
      if (score >= 60) return 'score-good';
      if (score >= 40) return 'score-warning';
      return 'score-danger';
    },
    getSeverityText(severity) {
      switch (severity) {
        case 'low': return '轻微';
        case 'medium': return '中等';
        case 'high': return '严重';
        default: return '未知';
      }
    },
    resetView() {
      uni.showToast({ title: '视角已重置', icon: 'success' });
    },
    toggleWireframe() {
      uni.showToast({ title: '切换线框模式', icon: 'none' });
    },
    takeScreenshot() {
      uni.showToast({ title: '截图已保存', icon: 'success' });
    },
    exportReport() {
      uni.showLoading({ title: '生成PDF中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: 'PDF报告已导出', icon: 'success' });
      }, 2000);
    },
    shareReport() {
      uni.showActionSheet({
        itemList: ['微信分享', '发送邮件', '复制链接'],
        success: (res) => {
          const actions = ['微信分享', '发送邮件', '复制链接'];
          uni.showToast({ 
            title: `${actions[res.tapIndex]}成功`, 
            icon: 'success' 
          });
        }
      })
    },
    saveToCloud() {
      uni.showLoading({ title: '保存中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '已保存到云端', icon: 'success' });
      }, 1500);
    },
    scheduleFollowup() {
      uni.showToast({ title: '跳转到预约页面', icon: 'none' });
    },
    startNewAnalysis() {
      this.currentStep = 1;
      this.uploadedFiles = [];
      this.analysisProgress = 0;
      this.analysisSteps.forEach(step => {
        step.active = false;
        step.completed = false;
      });
    }
  },
  onLoad() {
    console.log('CT Report page loaded');
  }
}
</script>

<style lang="scss">
.ct-report-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.ct-header {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 20px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  gap: 8px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  
  &.active,
  &.completed {
    opacity: 1;
  }
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  
  .step.active & {
    background: rgba(255, 255, 255, 0.9);
    color: #3b82f6;
  }
  
  .step.completed & {
    background: #22c55e;
    color: white;
  }
}

.step-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.step-line {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  
  &.active {
    background: rgba(255, 255, 255, 0.9);
  }
}

.page-content {
  padding: 16px;
  padding-bottom: 32px;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  display: block;
}

.card-desc {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.card-content {
  padding: 20px;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #374151;
  display: block;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
  display: block;
}

.file-list {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.file-list-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
  display: block;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.file-icon {
  font-size: 20px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-size: 14px;
  color: #374151;
  display: block;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  display: block;
}

.file-status {
  .uploading {
    color: #3b82f6;
    font-size: 12px;
  }
  
  .completed {
    color: #22c55e;
    font-size: 16px;
  }
  
  .remove-btn {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
}

.upload-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  
  &.uploading {
    background: #6b7280;
  }
}

.recent-scans {
  .scan-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:hover {
      background: #f9fafb;
    }
  }
  
  .scan-thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    background: #f3f4f6;
  }
  
  .scan-info {
    flex: 1;
  }
  
  .scan-title {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    display: block;
  }
  
  .scan-date {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
    display: block;
  }
  
  .scan-status {
    font-size: 12px;
    color: #22c55e;
    margin-top: 4px;
    display: block;
  }
  
  .scan-arrow {
    color: #9ca3af;
    font-size: 16px;
  }
}

.analysis-progress {
  text-align: center;
  margin-bottom: 32px;
}

.progress-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(#3b82f6 0deg, #e5e7eb 0deg);
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 90px;
    height: 90px;
    background: white;
    border-radius: 50%;
  }
}

.progress-text {
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
  position: relative;
  z-index: 1;
}

.analysis-stage {
  font-size: 16px;
  color: #374151;
  display: block;
}

.analysis-steps {
  .analysis-step {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 12px;
    opacity: 0.5;
    
    &.active {
      opacity: 1;
      background: #eff6ff;
      border: 1px solid #dbeafe;
    }
    
    &.completed {
      opacity: 1;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }
  }
  
  .step-icon {
    font-size: 24px;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-name {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    display: block;
  }
  
  .step-desc {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
    display: block;
  }
  
  .step-status {
    .completed-icon {
      color: #22c55e;
      font-size: 20px;
    }
    
    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #e5e7eb;
      border-top: 2px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

.cancel-btn {
  width: 100%;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  margin-top: 20px;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.preview-item {
  text-align: center;
}

.preview-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background: #f3f4f6;
}

.preview-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  display: block;
}

.analysis-score {
  position: absolute;
  top: 16px;
  right: 20px;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  
  &.score-excellent {
    background: #dcfce7;
    color: #16a34a;
  }
  
  &.score-good {
    background: #dbeafe;
    color: #2563eb;
  }
  
  &.score-warning {
    background: #fef3c7;
    color: #d97706;
  }
  
  &.score-danger {
    background: #fee2e2;
    color: #dc2626;
  }
}

.score-value {
  font-size: 24px;
  font-weight: bold;
  display: block;
}

.score-label {
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.summary-item {
  text-align: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  display: block;
  
  &.good {
    color: #22c55e;
  }
  
  &.warning {
    color: #f59e0b;
  }
  
  &.info {
    color: #3b82f6;
  }
}

.model-viewer {
  .model-placeholder {
    height: 300px;
    background: #f8fafc;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .model-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }
  
  .model-text {
    font-size: 18px;
    color: #374151;
    margin-bottom: 8px;
    display: block;
  }
  
  .model-hint {
    font-size: 14px;
    color: #6b7280;
    display: block;
  }
  
  .model-controls {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  
  .control-btn {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 12px;
  }
}

.findings-list {
  .finding-item {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .finding-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  
  .finding-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
  
  .finding-severity {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    
    &.low {
      background: #dcfce7;
      color: #16a34a;
    }
    
    &.medium {
      background: #fef3c7;
      color: #d97706;
    }
    
    &.high {
      background: #fee2e2;
      color: #dc2626;
    }
  }
  
  .finding-description {
    font-size: 14px;
    color: #374151;
    line-height: 1.5;
    margin-bottom: 12px;
    display: block;
  }
  
  .finding-location,
  .finding-recommendation {
    margin-bottom: 8px;
  }
  
  .location-label,
  .recommendation-label {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
  }
  
  .location-value,
  .recommendation-value {
    font-size: 14px;
    color: #374151;
  }
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  border: none;
  
  &.primary {
    background: #3b82f6;
    color: white;
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
}

.btn-icon {
  font-size: 24px;
}

.btn-text {
  font-size: 14px;
  font-weight: 500;
}

.new-analysis-btn {
  width: 100%;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 复用之前的通用样式
.flex {
  display: flex;
  margin-top: 10px;
}

.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.left-4 {
  left: 16px; /* adjust as needed */
}

.top-1-2 {
  top: 50%;
}

.-translate-y-1-2 {
  transform: translateY(-50%);
}

.text-center {
  text-align: center;
}

.flex-col {
  flex-direction: column;
}

.justify-between {
  justify-content: space-between;
}

.gap-4 {
  gap: 16px;
}

.text-2xl {
  font-size: 24px;
  color: rgba(219, 234, 254, 1);
}

.text-blue-100 {
  color: rgba(219, 234, 254, 1);
}

.block {
  display: block;
}

.mt-1 {
  margin-top: 4px;
}
</style>
