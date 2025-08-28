import * as THREE from '../lib'
// import * as THREE from 'three-platformize'
import {
	screenshot as shot
} from 'three-platformize/tools/screenshot'
import {
	initLoader
} from './loader.js'

import {
	useTween
} from './useTween'
import {
	$requestAnimationFrame,
	$cancelAnimationFrame
} from '../lib.js'

import {
	animation
} from './animation.js'

import {
	events
} from './event.js'

const {
	Easing,
	exec: execTween
} = useTween()

const isInit = {
	value: false
}
// 配置相关
const defaultFps = 60
const defaultConfig = {
	controlUpdateFlag: true, // 是否更新控制器
	renderFlag: true, // 是否渲染
	timeStamp: 0, // 上一次渲染的时间戳
	singleFrameTime: 1 / defaultFps, // 单帧时间
	fps: defaultFps, // 这里的fps是理想中的帧率，并不是实际渲染的帧率
}
const globalConfig = {}

// 设置渲染帧率
const setFps = (fps = defaultFps) => {
	globalConfig.fps = fps
	globalConfig.singleFrameTime = 1 / fps
}

// 是否更新控制器
const setControlUpdateFlag = (flag = true) => {
	globalConfig.controlUpdateFlag = flag
}
// 是否渲染
const setRenderFlag = (flag = true) => {
	globalConfig.renderFlag = flag
}


// 实例
const instance = {
	canvas: null, // 渲染模型的canvas
	helperCanvas: null, // 用于截图的canvas
	camera: null,
	scene: null,
	clock: null,
	group: null,
	renderer: null,
	controls: null,
	loader: null
}

const loopFuncs = []
let uid = 1;

const useLoop = (cb = () => {}) => {
	const funcId = ++uid;
	const stop = () => {
		loopFuncs.splice(
			loopFuncs.findIndex((item) => item.id === funcId),
			1
		)
	}
	loopFuncs.push({
		id: funcId,
		cb
	})

	return {
		loopFuncs,
		funcId,
		stop,
	}
}

const getInstance = () => {
	return {
		...instance
	}
}


// 开始渲染
let frameId;
const startRender = () => {
	const {
		controls,
		renderer,
		scene,
		camera,
		clock
	} = getInstance()


	const render = (t) => {
		controls.enabled = globalConfig.controlUpdateFlag
		controls.update()
		renderer.render(scene, camera);
	}
	const animate = () => {
		frameId = $requestAnimationFrame()(animate)
		const t = clock.getDelta()
		if (!isInit.value) {
			// 销毁了
			return
		}
		if (!globalConfig.renderFlag) {
			// 暂停渲染
			return
		}
		globalConfig.timeStamp += t
		if (globalConfig.timeStamp < globalConfig.singleFrameTime) {
			// 根据设置的帧率来渲染
			return
		}

		render(t)
		animation.update(t)
		loopFuncs.forEach(item => {
			item.cb && item.cb(t)
		})

		globalConfig.timeStamp = globalConfig.timeStamp % globalConfig.singleFrameTime

	}
	animate()
}


const initThreeJs = (inst = {}) => {
	Object.assign(instance, inst)
	instance.loader = initLoader()
	isInit.value = true
	// 重置配置
	Object.assign(globalConfig, defaultConfig)

	// 设置event.js中的参数
	const {
		camera
	} = getInstance()
	const rect = getContainerSize()
	events.setOptions({
		camera,
		rect
	})

	startRender()
}

// 居中和缩放模型，在模型加载之后执行
const centerAndScale = (scaleRatio = 0.6) => {
	const {
		group,
		camera,
		scene
	} = getInstance()

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
}

export const traverse = (g, cb = () => {}) => {
	if (!g?.isScene) {
		cb(g)
	}

	if (g.children && g.children.length) {
		g.children.forEach(c => {
			traverse(c, cb)
		})
	}
}

// 小程序texture不是2的n次方也会导致无法正常显示材质
const fixFbxMaterial = (group, materialType = 'MeshStandardMaterial') => {
	traverse(group, (c) => {
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
}
const dispose = () => {
	if (!isInit.value) {
		console.log('未初始化无需销毁场景')
		return
	}


	const {
		scene,
		renderer
	} = instance;
	isInit.value = false;
	loopFuncs.length = 0;
	$cancelAnimationFrame()(frameId)

	try {
		traverse(scene, (c) => {
			if (c.isMesh) {
				c.geometry.dispose();
				if (Array.isArray(c.material)) {
					c.material.forEach(m => {
						m.dispose()
					})
				} else {
					c.material.dispose();
				}
			}
			if (c.isTexture) {
				c.dispose();
			}
		})
		traverse(scene, (c) => {
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

}


// 设置环境贴图，传入在线地址即可
function getFileExtension(url) {
	// 找到最后一个点的位置
	const lastDotIndex = url.lastIndexOf('.');
	// 如果没有点，说明没有后缀，返回空字符串
	if (lastDotIndex === -1) {
		return '';
	}
	// 截取从最后一个点到字符串末尾的部分
	const extension = url.substring(lastDotIndex + 1);
	return extension;
}
const setEnv = async (url, isSetBg = true) => {
	const {
		scene,
		loader
	} = getInstance()

	return new Promise((resolve, reject) => {
		const ext = getFileExtension(url)
		if (ext === 'hdr') {
			loader.load(url, (texture) => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				scene.environment = texture
				if (isSetBg) scene.background = texture
				resolve(texture)
			}, 'hdr')
		} else {
			// 图片格式走这里
			loader.load(url, texture => {
				texture.minFilter = THREE.LinearFilter
				texture.mapping = THREE.EquirectangularReflectionMapping;
				scene.environment = texture
				if (isSetBg) scene.background = texture
				resolve(texture)
			}, 'texture')

		}
	})
}

// 截图,MP专用
// 使用方法
// const tempPath = await screenshot()
// uni.saveImageToPhotosAlbum({
// 	filePath:tempPath
// })
// #ifdef MP
const screenshot = async () => {
	const {
		scene,
		renderer,
		camera,
		helperCanvas
	} = getInstance()

	const [data, w, h] = shot(renderer, scene, camera, THREE.WebGLRenderTarget);
	const ctx = helperCanvas.getContext('2d')
	const imgData = helperCanvas.createImageData(data, w, h);
	helperCanvas.height = imgData.height;
	helperCanvas.width = imgData.width;
	ctx.putImageData(imgData, 0, 0);
	// const imgDataFromCanvas = ctx.getImageData(0, 0, w, h)
	// const hasPixel = imgDataFromCanvas.data.some(i => i !== 0)
	// console.log('hasPixel', hasPixel)

	return new Promise((resolve, reject) => {
		uni.canvasToTempFilePath({
			canvas: helperCanvas,
			success(res) {
				resolve(res.tempFilePath)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}
// #endif
// app、h5
// #ifndef MP
const screenshot = async () => {

	setFps(0)

	const {
		renderer,
	} = getInstance()

	return new Promise((resolve, reject) => {
		const canvas = renderer.domElement
		const url = canvas.toDataURL('image/png')
		resolve(url)
	})

	setFps(globalConfig.fps)
}

// #endif

// 获取模型节点列表
const getNodes = (extKeys = []) => {
	const {
		group
	} = getInstance()
	const nodeMap = {}
	const root = {
		name: 'root',
		id: 'root',
		uuid: 'root',
		layer: 0,
		children: []
	}



	const createItem = (item, layer) => {
		const result = {}
		extKeys.forEach(key => {
			result[key] = item[key]
		})
		return {
			name: item.name,
			id: item.id,
			uuid: item.uuid,
			type: item.type,
			...result,
			layer,
			children: []
		}
	}

	const toTree = (list) => {
		list.forEach(item => {
			const parent = item.parent
			if (parent.name === 'main-group') {
				nodeMap[item.id] = createItem(item, 1)
				root.children.push(nodeMap[item.id])
			}
			if (item.children) {
				if (!nodeMap[item.id]) {
					nodeMap[item.id] = createItem(item, nodeMap[parent.id].layer + 1)

					nodeMap[parent.id].children.push(nodeMap[item.id])
				}
				toTree(item.children)
			} else {
				nodeMap[parent.id] && nodeMap[parent.id].children.push(
					createItem(item, nodeMap[parent.id].layer + 1)
				)
			}
		})
	}

	toTree(group.children)


	return root.children
}

// 查找对象,也可以使用Object3D.getObjectByName等方法查找
// findByKey('RobotArmature','name')
// findByKey(c=>c.name==='RobotArmature')
const findByKey = (target, key = '') => {
	const {
		group
	} = getInstance()
	// 获取字段
	const getFeild = (object, key) => {
		const keys = key.split('.')
		for (const key of keys) {
			object = object[key]
		}
		return object
	}

	let result = null
	try {
		traverse(group, child => {
			// 有可能是通过userData中的参数查找，所以key可以是：'userData.uuid'
			if ((typeof target === 'function' && target(child)) || getFeild(child, key) === target) {
				result = child
				throw new Error('中断')

			}
		})
	} catch (error) {
		//TODO handle the exception
		// console.log('中断', error)
	}

	return result
}



// 获取容器尺寸

const getContainerSize = () => {
	const {
		canvas,
		container
	} = getInstance()
	// #ifdef MP
	// 小程序的width和height是原始尺寸*devicePixelRatio的，会导致event计算点击位置出错，所以这里需要除以devicePixelRatio或者使用clientWidth
	const {
		clientWidth: width,
		clientHeight: height,
		_left: left,
		_top: top
	} = canvas
	const right = left + width
	const bottom = top + height
	// #endif

	// #ifndef MP
	const {
		width,
		height,
		left,
		top,
		right,
		bottom
	} = container.getBoundingClientRect()
	// #endif


	return {
		width,
		height,
		left,
		top,
		right,
		bottom
	}


}


// 控制器回到默认位置
const controlReset = async ({
	duration = 1000,
	cb = () => {}
}) => {
	const {
		controls,
	} = getInstance()

	if (!duration) {
		controls.reset()
		return
	}

	// 禁用controls
	setControlUpdateFlag(false)

	const {
		target,
		target0,
		position0,
	} = controls
	const {
		position
	} = controls.object

	const v3 = new THREE.Vector3()
	const spherical = new THREE.Spherical()
	const sphericalTmp = new THREE.Spherical()
	spherical.setFromVector3(position)
	const startRadius = spherical.radius
	const startPhi = spherical.phi
	const StartTheta = spherical.theta
	spherical.setFromVector3(position0)
	const endRadius = spherical.radius
	const endPhi = spherical.phi
	const endTheta = spherical.theta
	const quat = new THREE.Quaternion().setFromUnitVectors(
		controls.object.up,
		new THREE.Vector3(0, 1, 0)
	)
	const quatInverse = quat.clone().invert()

	// target
	const startTargetX = target.x
	const startTargetY = target.y
	const startTargetZ = target.z
	const endTargetX = target0.x
	const endTargetY = target0.y
	const endTargetZ = target0.z

	const obj = {
		radius: startRadius,
		phi: startPhi,
		theta: StartTheta,
		targetx: startTargetX,
		targety: startTargetY,
		targetz: startTargetZ
	}

	return new Promise(r => {
		execTween(obj, duration, {
			radius: endRadius,
			phi: endPhi,
			theta: endTheta,
			targetx: endTargetX,
			targety: endTargetY,
			targetz: endTargetZ,
			onComplete: () => {
				setControlUpdateFlag(true)
				cb && cb()
				r()
			},
			onUpdate: () => {
				let {
					phi,
					theta,
					radius,
					targetx,
					targety,
					targetz
				} = obj
				// sphericalTmp.theta = theta;
				sphericalTmp.theta = Math.max(
					controls.minAzimuthAngle,
					Math.min(controls.maxAzimuthAngle, theta)
				)
				// sphericalTmp.phi = phi;
				sphericalTmp.phi = Math.max(controls.minPolarAngle, Math
					.min(
						controls
						.maxPolarAngle,
						phi))
				sphericalTmp.makeSafe()

				// sphericalTmp.radius = radius;
				sphericalTmp.radius = Math.max(controls.minDistance, Math
					.min(
						controls
						.maxDistance,
						radius))
				v3.setFromSpherical(sphericalTmp)
				v3.applyQuaternion(quatInverse)
				controls.object.position.copy(controls.target).add(v3)
				controls.target.set(targetx, targety, targetz)
				controls.object.lookAt(controls.target)

				controls.object.updateProjectionMatrix()
				controls.update()
			}
		})
	})






}



export function useThreeJs() {
	return {
		centerAndScale,
		useLoop,
		loopFuncs,
		initThreeJs,
		isInit,
		dispose,
		getInstance,
		setEnv,
		screenshot,
		getContainerSize,
		setFps,
		setControlUpdateFlag,
		setRenderFlag,
		globalConfig,
		controlReset,
		fixFbxMaterial,
		getNodes,
		findByKey
	}
}