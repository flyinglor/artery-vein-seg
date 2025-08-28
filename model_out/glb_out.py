import bpy
import os

# 重置 Blender 到默认设置
bpy.ops.wm.read_factory_settings(use_empty=True)

# 定义文件路径
filepath1 = r"temp\temp_1.stl"
filepath2 = r"temp\temp_2.stl"
output_path = r"temp\output.glb"

# 导入第一个 STL 并染红
bpy.ops.wm.stl_import(filepath=filepath1)
print("Open:", filepath1, "success!")
target_obj = bpy.data.objects["temp_1"]
bpy.context.view_layer.objects.active = target_obj
target_obj.select_set(True)

mat = bpy.data.materials.new(name="Red_Material")
mat.use_nodes = True
target_obj.data.materials.append(mat)
bsdf = target_obj.data.materials[0].node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (1, 0, 0, 1)  # 红色

# 导入第二个 STL 并染蓝
bpy.ops.wm.stl_import(filepath=filepath2)
print("Open:", filepath2, "success!")
target_obj = bpy.data.objects["temp_2"]
bpy.context.view_layer.objects.active = target_obj
target_obj.select_set(True)

mat = bpy.data.materials.new(name="Blue_Material")
mat.use_nodes = True
target_obj.data.materials.append(mat)
bsdf = target_obj.data.materials[0].node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.0, 0.0, 1.0, 1.0)  # 蓝色

# 导出为 GLB（启用 Draco 压缩）
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_apply=True,
    export_draco_mesh_compression_enable=True,  # 启用压缩
    export_draco_mesh_compression_level=6,      # 压缩级别（1-10）
    export_tangents=False
)

print("Exported compressed GLB to:", output_path)