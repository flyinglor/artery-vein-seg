<script>
	export default {
		onLaunch: function() {
			// 确保全局启动时隐藏 loading
			if (uni && uni.hideLoading) {
			    uni.hideLoading();
			}
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
