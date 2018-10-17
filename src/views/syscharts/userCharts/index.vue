<template>
  <div class="app-container documentation-container">
    <h1>用户统计图表</h1>
  </div>
</template>
<script>
// import DropdownMenu from '@/components/Share/dropdownMenu'

export default {
  name: 'UserCharts',
  // components: { DropdownMenu },
  data() {
    return {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
