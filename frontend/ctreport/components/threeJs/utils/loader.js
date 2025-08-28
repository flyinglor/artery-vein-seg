import * as THREE from '../lib.js'
import {
	GLTFLoader,
	RGBELoader,
	OBJLoader,
	FBXLoader,
	DRACOLoader
} from '../lib.js'
// EXT_meshopt_compression模型压缩相关
// https://blog.csdn.net/whl0071/article/details/127864929
// npm i -g gltfpack
// gltfpack -i model.glb -o out.glb -cc
// use
// https://github.com/deepkolos/platformize/blob/main/examples/tests-three/MeshOpt.ts
// js版本
import {
	MeshoptDecoder
} from './meshopt/meshopt_decoder.asm.module.js'
// wasm版本,仅支持微小程序
// 需要手动将decoder_base.wasm复制到打包之后的/pages/index目录下，或者vite指定文件不参与构建，或者实现一个plugin自动复制
// import { MeshoptDecoder } from './meshopt/meshopt_decoder.wasm.module.js'

import {
	animation,
	initAnimation
} from './animation'

import {
	onUnmounted
} from 'vue'




// const gltfLoader = new GLTFLoader()
// gltfLoader.setMeshoptDecoder(MeshoptDecoder);
// 这两行需要在PLATFORM.set 设置后执行
export const initLoader = () => {

	const gltfLoader = new GLTFLoader()
	// MeshoptDecoder.setWasmPath('/pages/index/decoder_base.wasm');  // wasm版本,仅支持微小程序
	gltfLoader.setMeshoptDecoder(MeshoptDecoder);



	// 加载glb模型,url 是资源在线地址或者buffer
	const loadGlb = (url, callback = () => {}) => {
		// 如果传入的url不是string会被当成buffer看待
		const isArrayBuffer = typeof url !== 'string'
		return new Promise(async (resolve, reject) => {
			try {
				if (isArrayBuffer) {
					gltfLoader.parse(url, "", (gltf) => {
						initAnimation(gltf)
						callback && callback(gltf)
						resolve(gltf)
					}, (err) => {
						reject(err)
					})
				} else {
					const gltf = await gltfLoader.loadAsync(url)
					initAnimation(gltf)
					callback && callback(gltf)
					resolve(gltf)
				}

			} catch (error) {
				reject(error)
			}

		})
	}


	// 加载其他格式的模型
	const loadOtherModel = (url, callback = () => {}, type) => {
		let loader;
		return new Promise((resolve, reject) => {
			switch (type) {
				case 'obj':
					loader = new OBJLoader()
					break;
				case 'fbx':
					loader = new FBXLoader()
					break;
				default:
					break;
			}
			loader.load(url, (result) => {
				callback && callback(result)
				resolve(result)
			}, null, err => reject(err))
		})
	}

	// 加载hdr
	const loadHdr = async (url, callback) => {
		return new Promise((resolve, reject) => {
			new RGBELoader().load(url, texture => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				callback && callback(texture)
				resolve(texture)
			}, null, err => reject(err))
		})
	}
	// 加载普通图片
	const loadTexture = async (url, callback) => {
		return new Promise((resolve, reject) => {
			new THREE.TextureLoader().load(url, texture => {
				texture.minFilter = THREE.LinearFilter
				texture.mapping = THREE.EquirectangularReflectionMapping;
				callback && callback(texture)
				resolve(texture)
			}, null, err => reject(err))
		})
	}

	const load = async (url, callback = () => {}, resType = '') => {

		if (resType == '') {
			// 获取url后缀
			const suffix = url.split('.').pop()
			resType = suffix || 'glb'
			// 判断是不是图片，如果是图片重置为texture
			if (suffix == 'jpg' || suffix == 'png') {
				resType = 'texture'
			}
		}


		switch (resType) {
			case 'glb':
				return loadGlb(url, callback)
				break;
			case 'gltf':
				return loadGlb(url, callback)
				break;
			case 'hdr':
				return loadHdr(url, callback)
				break;
			case 'texture':
				return loadTexture(url, callback)
				break
			default:
				return loadOtherModel(url, callback, resType)
				// throw new Error(`暂不支持${resType}格式`)
				break;
		}
	}

	const setPath = (path) => {
		gltfLoader.setPath(path)
	}

	return {
		load,
		setPath
	}
}