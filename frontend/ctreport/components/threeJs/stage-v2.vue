<template>
	<view class="w-full h-full relative" @click="handleClick">
		<!-- #ifndef MP -->
		<div ref="container" class="w-full h-full">

		</div>
		<!-- #endif -->

		<!-- #ifdef MP -->
		<!-- 只有小程序需要这两个canvas，其他端通过js的方式创建canvas -->
		<canvas v-if="autoInit" class="w-full h-full" type="webgl" id="webgl" @touchstart="onTX" @touchmove="onTX"
			@touchend="onTX"></canvas>
		<canvas v-if="autoInit" id="helperCanvas" type="2d" class="fixed left-99999 opacity-0"></canvas>
		<!-- #endif -->
		<slot></slot>
	</view>


</template>

<script>
	import * as THREE from './lib'

	import {
		OrbitControls,
		Platform,
		$requestAnimationFrame,
		$cancelAnimationFrame,
		devicePixelRatio
	} from './lib'


	import {
		useThreeJs,
		events,
		animation
	} from './index.js'

	const {
		isInit,
		initThreeJs,
		getInstance,
		loopFuncs,
		useLoop,
		dispose,
	} = useThreeJs()

	let canvas, platform, frameId, disposing;

	export default {
		props: {
			autoInit: {
				type: Boolean, // 抖音小程序传入false在页面内初始化，而不是组件内
				default: true
			},
			disableRaycaster: { //是否禁用射线检测（模型点击）
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				container: null
			}
		},
		async mounted() {
			this.container = this.$refs.container
			if (!this.autoInit) return
			const c = await this.getCanvas()
			const h = await this.getCanvas('#helperCanvas')
			this.init(c, h)
		},
		beforeDestroy() {
			this.destroy()
		},
		methods: {
			async getCanvas(id = '#webgl') {
				return new Promise((resolve) => {
					// 组件中获取用proxy，外部获取用uni
					// #ifdef MP
					this.createSelectorQuery()
						.select(id)
						.node(v => v)
						.exec((res) => {
							const canvas = res && res.length ? res[0].node : null
							resolve(canvas)
						})
					// #endif
					// #ifdef APP-PLUS || H5
					resolve(document.querySelector(`${id} canvas`))
					// #endif

				})
			},
			destroy() {
				// 使用完毕后释放资源
				disposing = true
				$cancelAnimationFrame()(frameId)
				animation.dispose()
				events.removeEvents()
				dispose()
				// #ifndef APP
				THREE.PLATFORM && THREE.PLATFORM.dispose();
				// #endif
			},
			handleClick(evt) {
				if (this.disableRaycaster) {
					// 仅用了摄像检测
					return
				}
				if (!isInit.value) {
					console.log('等待初始化完毕')
					return;
				}
				events.onEvent(evt)
			},
			onTX(e) {
				this.$emit('touch', e)
				platform && platform.dispatchTouchEvent(e)
			},
			async init(c, helperCanvas) {
				let webglRender = 'WebGLRenderer';
				canvas = c
				// #ifdef MP
				webglRender = 'WebGL1Renderer'
				platform = new Platform(canvas)
				// #ifndef APP
				THREE.PLATFORM.set(platform);
				// #endif
				const {
					width,
					height
				} = canvas
				// #endif

				// #ifndef MP
				const {
					width,
					height
				} = this.container.getBoundingClientRect()
				// #endif
				const renderer = new THREE[webglRender]({
					// #ifdef MP
					canvas,
					// #endif
					preserveDrawingBuffer: true, // 设置 canvas 可toDataURL
					antialias: true,
					alpha: true,
					logarithmicDepthBuffer: true
				})


				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1
				// THREEJS 150左右就开始使用SRGBColorSpace了
				// #ifdef MP
				renderer.outputEncoding = THREE.sRGBEncoding
				// #endif
				// #ifndef MP
				renderer.outputEncoding = THREE.SRGBColorSpace
				// #endif
				renderer.setSize(width, height)
				renderer.setPixelRatio(devicePixelRatio)
				// #ifndef MP
				this.container.appendChild(renderer.domElement)
				// #endif

				const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
				camera.position.z = 10
				const scene = new THREE.Scene()
				// 微信开发工具canvas层级显示有问题，真机没问题
				// scene.background = new THREE.Color('#f2f2f2')
				const clock = new THREE.Clock();
				const group = new THREE.Group()
				group.name = 'main-group'
				scene.add(group)
				// #ifdef MP
				const controls = new OrbitControls(camera, canvas);
				// #endif
				// #ifndef MP
				const controls = new OrbitControls(camera, renderer.domElement);
				// #endif

				controls.enablePan = false // 禁止平移摄像机
				controls.enableDamping = true //惯性
				controls.autoRotate = false;
				controls.autoRotateSpeed = 1.6

				initThreeJs({
					canvas,
					container:this.container, // canvas 父容器
					helperCanvas, // 用于截图等操作
					camera,
					scene,
					clock,
					group,
					renderer,
					controls,
				})

				this.$emit('onload')
			},
		}
	}
</script>


<style lang="scss">
	.w-full {
		width: 100%
	}

	.h-full {
		height: 100%;
	}

	.relative {
		position: relative;
	}

	.fixed {
		position: fixed;
	}

	.left-99999 {
		left: 99999;
	}

	.opacity-0 {
		opacity: 0;
	}
</style>