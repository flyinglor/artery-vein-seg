<template>
	<view class="w-full h-full relative" :prop="$props" :callParam="callParam" :change:callParam="three.callSelfMethod"
		:change:prop="three.init">
		<div id='container' class="w-full h-full" @click="three.handleClick">
		</div>
		<!-- 自己写逻辑可以这样调用方法比较方便。 -->
		<!-- <button @click="three.xxx"></button> -->
	</view>
</template>

<script>
	export default {
		props: {
			// 模型链接
			modelurl: {
				type: String,
				default: ''
			},
			// 手动指定模型类型，比如h5预览本地模型可能会用到
			modelType: {
				type: String,
				default: '', // 'glb'
			},
			// 环境贴图链接
			env: {
				type: String,
				default: ''
			},
			// 环境贴图是否可见
			backgroundVisible: {
				type: Boolean,
				default: false
			},
			// 模型缩放比例
			scale: {
				type: Number,
				default: 0.6
			},
			// 模型自动旋转
			autoRotate: {
				type: Boolean,
				default: false
			},
			// 自动旋转速度
			autoRotateSpeed: {
				type: Number,
				default: 1.6
			},
			// 用于执行一些渲染层的方法
			playOptions: {
				type: Object,
				default: {}
			},
			isFixFbxMaterial: {
				type: Boolean,
				default: false
			},
			disableRaycaster: { //是否禁用射线检测（模型点击）
				type: Boolean,
				default: true
			}
		},
		data() {
			this.listeners = {}
			return {
				callParam: {
					// key: 'render.js中的方法名',
					// args: [], // 参数,应该是一个数组
					// isReturn:false //是否接受返回值，默认false
				},
			}
		},
		mounted() {},
		methods: {
			// 用于调用render.js中的方法的
			async call(callParam) {
				callParam._t = Date.now()
				this.callParam = callParam
				return new Promise((resolve, reject) => {
					if (callParam.isReturn) {
						this.listeners[callParam.key] = {
							resolve,
							reject
						}
					} else {
						resolve()
					}
				})
			},
			// render.js中的返回值
			callback(callParam) {
				const {
					resolve,
					reject
				} = this.listeners[callParam.key]
				if (!callParam.err) {
					resolve && resolve(callParam?.args)
				} else {
					reject && reject(callParam.err)
				}
				delete this.listeners[callParam.key]
				this.callParam = {}
			},
			loaded() {
				this.$emit('loaded')
			},
		},
	}
</script>
<script module="three" lang="renderjs">
	const instance = {}
	import * as THREE from 'three'
	import {
		OrbitControls
	} from 'three/examples/jsm/controls/OrbitControls.js'
	import {
		FBXLoader
	} from 'three/examples/jsm/loaders/FBXLoader.js'
	import {
		OBJLoader
	} from 'three/examples/jsm/loaders/OBJLoader.js'
	import {
		GLTFLoader
	} from 'three/examples/jsm/loaders/GLTFLoader.js'
	import {
		RGBELoader
	} from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
	import {
		animation,
		initAnimation
	} from './utils/animation.js'

	import {
		events
	} from './utils/event.js'


	export default {
		data() {
			this.frameId = 0
			return {
				isInit: false,
				props: {}
			}
		},
		mounted() {

		},

		computed: {

		},
		methods: {
			async getNum(n) {
				return new Promise(r => {
					setTimeout(function() {
						r(n * 2)
					}, 1000);
				})
			},
			async callSelfMethod({
				key,
				args = [],
				isReturn = false
			}) {
				if (!key || !args) return
				let result = this[key](...args)
				if (isReturn) {
					if (result instanceof Promise) {
						try {
							result = await result
							this.$ownerInstance.callMethod('callback', {
								key,
								args: result,
							})
						} catch (error) {
							this.$ownerInstance.callMethod('callback', {
								key,
								err: error
							})
						}
						return
					}
					this.$ownerInstance.callMethod('callback', {
						key,
						args: result
					})
				}

			},
			handleClick(evt) {
				const {
					disableRaycaster
				} = this.props
				if (disableRaycaster) {
					console.log('禁用了射线检测')
					return
				}
				if (!this.isInit) {
					console.log('等待初始化完毕')
					return
				}
				events.onEvent(evt)
			},
			// 貌似不需要销毁，会自动销毁相关变量
			// 退出页面requestAnimationFrame不会在执行了
			destroy() {
				cancelAnimationFrame(this.frameId)
				animation.dispose()
				const {
					group,
					scene,
					renderer
				} = instacen
				try {
					group.traverse(c => {
						if (c.isMesh) {
							c.geometry.dispose();
							c.material.dispose();
						}
						if (c.isTexture) {
							c.dispose();
						}
					})

					scene.traverse(c => {
						if (c.parent) {
							c.parent.remove(c);
						}
					})
					for (let i = scene.children.length - 1; i >= 0; i--) {
						scene.remove(scene.children[i]);
					}

					scene.clear();
					renderer.dispose();
					renderer.forceContextLoss();
					renderer.content = null;

					for (const key in instance) {
						instance[key] = null
					}
					console.log('场景销毁')
				} catch (error) {
					//TODO handle the exception
					console.log('dispose error:', error)
				}
			},
			// 居中和缩放模型，在模型加载之后执行
			centerAndScale(scaleRatio = 0.6) {
				const {
					group,
					camera,
					scene
				} = instance

				group.position.set(0, 0, 0) // 需要复位一下，否则切换模型位置会不对
				group.scale.set(1, 1, 1) // 需要复位一下，否则切换模型位置会不对

				const boundingBox = new THREE.Box3().setFromObject(group);

				// const helper = new THREE.Box3Helper( boundingBox, 0xffff00 );
				// scene.add(helper)

				// 缩放
				// let scaleRatio = 0.6 // 模型最大边（高度或者宽度）占据屏幕的60%

				// 获取模型的边界框来确定其尺寸
				const modelSize = boundingBox.getSize(new THREE.Vector3());

				// 计算模型的高宽比
				const aspectRatio = modelSize.y / modelSize.x;

				// 计算相机视锥体的垂直高度（基于相机FOV和距离）
				// const fov = THREE.Math.degToRad(camera.fov); // 将FOV转换为弧度
				const fov = camera.fov * (Math.PI / 180);
				const cameraDistance = camera.position.length(); // 相机到模型的距离（假设相机在z轴上）
				const viewHeight = 2 * Math.tan(fov / 2) * cameraDistance; // 视锥体垂直高度
				// 由于我们使用的是相机的宽高比，我们不需要计算viewWidth，因为viewWidth = viewHeight * camera.aspect
				const viewWidth = viewHeight * camera.aspect;
				// 计算缩放比例
				let scale = 1;
				if (aspectRatio > 1) {
					// 模型高度占主导，缩放以适应视锥体的高度
					scale = viewHeight / modelSize.y * scaleRatio;
					// 检查按高度缩放后的宽度是否超出视锥体宽度
					const scaledWidth = modelSize.x * scale;
					const offset = 1 - scaleRatio
					if (scaledWidth > viewWidth - offset) {
						// 如果超出，计算超出的差值重新计算比例
						const ratio = (scaledWidth - viewWidth) / scaledWidth
						scale -= ratio * scale + 0.2 * scale
					}

				} else {
					// 如果是宽度大于高度的模型，在手机上可以放大scaleRatio
					// scaleRatio = 0.8
					scaleRatio = scaleRatio * 1.3
					// 模型宽度占主导，但由于我们使用的是相机的宽高比
					scale = viewWidth / modelSize.x * scaleRatio;


					// 检查按宽度缩放后的高度是否超出视锥体高度
					const scaledHeight = modelSize.y * scale;
					const offset = 1 - scaleRatio
					if (scaledHeight > viewHeight - offset) {
						// 如果超出，计算超出的差值重新计算比例
						const ratio = (scaledHeight - viewHeight) / scaledHeight
						scale -= ratio * scale + 0.2 * scale
						// 如果超出，则根据高度重新计算缩放比例
					}
				}

				const scaledWidth = modelSize.x * scale;
				const scaledHeight = modelSize.y * scale;

				// 应用缩放
				group.scale.set(scale, scale, scale);

				// 居中
				const center = new THREE.Vector3()
				boundingBox.getCenter(center)
				// 重新设置模型的位置，使之居中
				group.position.sub(center).multiplyScalar(scale);
			},
			setEnv() {
				const {
					backgroundVisible,
					env,
				} = this.props
				if (!env) return
				const rgbeLoader = new RGBELoader()
				rgbeLoader.load(env, texture => {
					texture.mapping = THREE.EquirectangularReflectionMapping;
					instance.scene.environment = texture
					if (backgroundVisible) instance.scene.background = texture
				})
			},
			fixFbxMaterial(group, materialType = 'MeshStandardMaterial') {
				group.traverse((c) => {
					if (c.isMesh) {
						const m = c.material;
						let material = new THREE[materialType]({});
						if (Array.isArray(m)) {
							material = m.map(item => {
								const tempMaterial = new THREE[materialType]({});
								tempMaterial.copy(item);
								return tempMaterial
							})
						} else {
							material.copy(m);
						}

						c.material = material;
					}
				});
			},
			getLoader(url, suffix = '') {
			  let loader;
			  if (suffix == '') {
			    suffix = url.split('.').pop()
			  }
			  switch (suffix) {
			    case 'glb':
			    case 'gltf':
			      const gltfLoader = new GLTFLoader();
			      // ========== 新增 Draco 支持 ==========
			      const dracoLoader = new DRACOLoader();
			      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/'); // 使用CDN
			      gltfLoader.setDRACOLoader(dracoLoader);
			      loader = gltfLoader;
			      break;
			    case 'fbx':
			      loader = new FBXLoader();
			      break;
			    case 'obj':
			      loader = new OBJLoader();
			      break;
			    default:
			      break;
			  }
			  return loader;
			},
			loadModel() {
			  const { modelurl, scale, isFixFbxMaterial, modelType } = this.props;
			  const { controls, group } = instance;
			  controls.reset();
			
			  // 清空旧模型
			  [...group.children].forEach(c => c.removeFromParent());
			
			  const loader = this.getLoader(modelurl, modelType);
			  if (!loader) return;
			
			  // ========== 新增 Promise 封装 ==========
			  new Promise((resolve, reject) => {
			    loader.load(
			      modelurl,
			      (res) => resolve(res),
			      undefined,
			      (err) => reject(err)
			    );
			  })
			  .then(res => {
			    initAnimation(res);
			    res = res?.scene || res;
			    group.add(res);
			    
			    const ext = modelurl.split('.').pop();
			    if (ext === 'fbx' && isFixFbxMaterial) {
			      this.fixFbxMaterial(group);
			    }
			    this.centerAndScale(scale);
			    this.$ownerInstance.callMethod('loaded');
			  })
			  .catch(err => {
			    console.error('模型加载失败:', err);
			    uni.showToast({ title: '模型加载失败', icon: 'none' });
			  });
			},
			async playAnimation({
				animationName,
				needReverse = false,
				attr = {}
			}) {
				const {
					group,
				} = instance
				const [model] = [...group.children]
				await animation.play(model, animationName, needReverse, attr)
			},
			update() {
				if (!Object.keys(instance).length) {
					return
				}
				const {
					props
				} = this;
				const {
					controls
				} = instance
				controls.autoRotate = props.autoRotate;
				controls.autoRotateSpeed = props.autoRotateSpeed
			},

			// 模型点击
			onClick() {
				// 点击相关
				const rect = container.getBoundingClientRect()
				events.setOptions({
					camera: instance.camera,
					rect
				})


				const seleObj = ({
					object
				}) => {
					// 让模型闪一下红色
					if (object.userData?.active) return
					object.userData.active = true
					const m = object.material
					const activeColor = new THREE.Color(0xff0000)
					if (m.color.getHex() == activeColor.getHex()) { // 如果模型本身就是红色，那就闪绿色
						activeColor.set(0x00ff0f)
					}
					m.colorOld = m.color.getHex()
					setTimeout(() => {
						m.color.set(activeColor)
					}, 30)
					setTimeout(() => {
						m.color.set(m.colorOld)
						object.userData.active = false
					}, 800)

				}
				// 点击模型事件，我这里是点击机器人的眼睛
				// 第一个参数是个数组，每项是Object3D
				// 第二个参数是个回调，返回此次屏幕发出的射线所命中的mesh数组
				const remove = events.onClickMesh(instance.group.children, (intersects) => {
					// 需要根据自己的业务逻辑来找到对应的mesh
					let isSele = false;
					// 注意：隐藏的模型还是可以命中的，即object.visible == false 也会被命中
					// 命中的都是mesh，你需要的可能是某个mesh的parent，根据自己的业务逻辑寻找
					for (let i = 0; i < intersects.length; i++) {
						const {
							object
						} = intersects[i]
						if (!object.visible) {
							continue
						}
						// 如果第一个不是隐藏的模型，不是眼镜就是没有点击到我要找的mesh
						if (!["Head_4"].includes(object
								.name)) {
							return
						}
						seleObj(intersects[i])
						if (isSele) break
					}
				})

			},
			init(props) {
				if (this.isInit) {
					// 播放动画
					if (!!props.playOptions?.animationName) {
						this.playAnimation(props.playOptions)
						return
					}
					// 切换模型
					if (props.modelurl && props.modelurl !== this.props.modelurl) {
						this.props = props
						this.loadModel()
					}
					this.update()
					return
				}
				this.isInit = true
				this.props = props
				const container = document.querySelector('#container')
				let {
					width,
					height
				} = container.getBoundingClientRect()
				const renderer = new THREE.WebGLRenderer({
					preserveDrawingBuffer: true, // 设置 canvas 可toDataURL
					antialias: true,
					alpha: true,
					logarithmicDepthBuffer: true
				})

				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1
				// 如果使用133版本需要修改SRGBColorSpace
				renderer.outputEncoding = THREE.SRGBColorSpace

				renderer.setSize(width, height)
				renderer.setPixelRatio(2)
				container.appendChild(renderer.domElement)

				const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
				camera.position.z = 10
				const scene = new THREE.Scene()
				// 微信开发工具canvas层级显示有问题，真机没问题
				// scene.background = new THREE.Color('#f2f2f2')
				const clock = new THREE.Clock();
				const group = new THREE.Group()
				group.name = 'main-group'
				scene.add(group)

				const controls = new OrbitControls(camera, renderer.domElement);
				controls.enablePan = false // 禁止平移摄像机
				controls.enableDamping = true //惯性
				controls.autoRotate = props.autoRotate;
				controls.autoRotateSpeed = props.autoRotateSpeed

				Object.assign(instance, {
					container, // canvas 父容器
					camera,
					scene,
					clock,
					group,
					renderer,
					controls,
				})

				const render = () => {
					controls.update()
					renderer.render(scene, camera);
				}

				const animate = () => {
					const t = clock.getDelta()
					animation.update(t)
					this.frameId = requestAnimationFrame(animate)
					render()
				}
				animate()
				this.setEnv()
				this.loadModel()
				this.onClick()

			},
		},
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