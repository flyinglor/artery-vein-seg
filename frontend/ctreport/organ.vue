<template>
	<view style="flex:1;">
		<!-- 模型显示区域 -->
		<view style="width: 90%;height: 70vh;background: rgba(0,0,0,0.2); margin: auto;  padding: 10px; border-radius: 8px;" v-if="options">
			<Preview3D @loaded="loaded" ref="preview" v-bind="options">
			</Preview3D>
		</view>
		<!-- 功能区 -->
		<view>
			<button @click="play" class="mini-btn" size="mini" type="warn">播放动画</button>
			<button @click="heart"class="mini-btn" size="mini" type="primary">心脏</button>
			<button @click="lung" class="mini-btn" size="mini" type="primary">肺部血管</button>
			<button @click="brain" class="mini-btn" size="mini" type="primary">大脑</button>
			<button @click="change" class="mini-btn" size="mini" type="primary">切换</button>
			<button @click="rotate" class="mini-btn" size="mini" type="primary">旋转</button>
		</view>
	</view>
</template>

<script>
	// 模型尺寸不对，是模型的问题，可以无视，可以尝试切换modelurl的值，这里使用机器人是为了播放动画
	// 或者直接点击切换模型看头盔的
import Preview3D from '@/components/threeJs/preview3D.vue'
export default {
	components: {
		Preview3D
	},
	data() {
		return {
			options: null

		}
	},
	mounted() {
		// 初始化数据
		this.options = {
			// modelurl: "/meshopt.glb", // EXT_meshopt_compression压缩过的模型
			modelurl: "/static/model/lungv.glb",
			// 如果自己的设备黑屏不显示模型，请换成jpg
			// /de_balie-compress.jpg
			env: this.$getUrl("/studio_small_09_1k.hdr"),
			// 缩放比例
			scale: .6,
			// 是否显示环境贴图
			backgroundVisible: false,
			// 自动旋转
			autoRotate: false,
			// 旋转速度
			autoRotateSpeed: 5.0,
			isFixFbxMaterial:false, // 是否修复fbx材质显示不正确，如果是fbx模型且显示不正确考虑开启，请自行控制
		}
		uni.showLoading({
			title: '加载中'
		})
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
		heart(){
			this.options.modelurl ="/static/model/vessel.glb"
		},
		lung(){
			this.options.modelurl ="/static/model/lungv.glb" 
		},
		brain(){
			this.options.modelurl ="/static/model/vessel.glb"
		},
		rotate(){
			this.options.autoRotate = !this.options.autoRotate
		},
		loaded() {
			// 模型加载完毕
			uni.hideLoading()
			console.log("模型加载完毕")
		},
		play() {
			// 对于播放动画，app端，建议自己直接修改stageApp.vue代码，因为外部调用太麻烦了
			this.$refs.preview.play('Idle', false, {
				isReset: true, // 播放完毕回到初始状态，可以再次播放
			})
		}
	}
}
</script>

<style>
    .mini-btn {
        margin-right: 10rpx;
    }
</style>