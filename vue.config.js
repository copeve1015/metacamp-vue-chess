module.exports = {
  // Vue CLI v3.x
  configureWebpack: {
    // 필요한 경우 플러그인을 설정합니다.
    externals: {
      // process와 module을 전역 객체로 사용하지 않도록 설정합니다.
      process: 'process',
      module: 'module'
    }
  },
}