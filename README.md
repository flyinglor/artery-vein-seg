# artery-vein-seg

## 📌 项目简介

本仓库包含 **动静脉血管分割与前端可视化系统** 的相关代码，主要模块包括：

* **model_train**：基于深度学习的动静脉分割模型训练代码
* **frontend**：前端可视化系统（上传影像、分割结果展示、报告生成）
* **model_out**：分割结果的三维重建模块（

## ⚙️ 开发环境配置

### 依赖与工具链

* **操作系统**：Linux / macOS / Windows
* **Python**：≥ 3.8
* **Node.js**：≥ 16.x
* **NPM**：≥ 8.x
* **HBuilderX**：最新稳定版（用于前端可视化调试）
* **Google Colab**：用于模型训练

## 🧩 模块说明与使用

### 1. 模型训练（`model_train/`）

* 运行环境：**Google Colab**
* 数据集路径约定：

  * 输入数据：`dataset/input/`
  * 动脉标签：`dataset/label/artery/`
  * 静脉标签：`dataset/label/vein/`
* 使用步骤：

  1. 将数据上传至对应目录
  2. 打开 `model_train/` 中的 Notebook
  3. 执行训练脚本，输出模型权重文件

### 2. 前端系统（`frontend/`）

* 功能：上传 CT 影像、查看分割结果、生成报告
* 使用步骤：

  ```bash
  # 安装依赖
  cd ctreport/
  npm install

  # 使用 HBuilderX 打开项目并运行到浏览器
  ```

### 3. 三维可视化（`model_out/`）

* 功能：分割结果的 3D 重建
* 使用步骤
  使用python运行 `model_out/model_out.py`
* 依赖：确保电脑中安装blender软件并导入PATH中
  ```
  blender -noaudio --background --python glb_out.py
  ```

如果无法运行上面语句说明blender环境没有配置好

安装包的时候常见问题：[【报错】Building wheel for SimpleITK (pyproject.toml) ... |卡住_error: could not build wheels for simpleitk, which-CSDN博客](https://blog.csdn.net/weixin_46046227/article/details/136591265)

## 🚀 编译与部署方法

1. **后端/模型训练**

   * 目前采用 Colab 环境运行，无需额外部署
   * 后续可通过 Docker 封装训练与推理流程
2. **前端系统**

   * 开发环境：运行在 HBuilderX + 浏览器
   * 部署方式（可选）：

     * `npm run build` 生成静态文件
     * 部署至 Nginx / Apache / 其他静态资源服务器
3. **未来计划**

   * 提供完整的 Docker 镜像
   * 支持云端/本地一键部署

## 📂 仓库结构

```
├── model_train/          # 模型训练代码（Colab）
│   ├── dataset/
│   │   ├── input/        # 输入影像
│   │   └── label/        # 标签（artery/vein）
│
├── frontend/             # 前端可视化系统
│   └── ctreport/         # Vue.js 工程
│
├── model_out/     # 三维可视化
│
└── README.md             # 使用说明
```

---
