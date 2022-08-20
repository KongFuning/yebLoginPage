<template>
  <div>
    <!-- 粒子背景 -->
    <vue-particles
      class="login-background" color="#97D0F2" :particleOpacity="1" :particlesNumber="100"
      shapeType="circle" :particleSize="5" linesColor="#97D0F2" :linesWidth="1"
      :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="3"
      :hoverEffect="true" hoverMode="grab" :clickEffect="true"clickMode="push">
    </vue-particles>
    <!-- 表情图部分 -->
    <img :src="loginSrc" alt="表情图" class="loginImages" />
    <!-- 卡片 —— 欢迎语 -->
    <el-card class="box-card1" v-if="card1Visible">
      <div slot="header" class="clearfix">
        <span style="font-weight:bold;">Welcome YY EWork ~  By:Kong</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="card1Visible = false">X</el-button>
      </div>
      <div class="text item">
        {{ "欢迎来到歪歪云办公平台！" }}
      </div>
    </el-card>
    <!-- 卡片 —— 天气 -->
    <el-card class="box-card2" v-if="card2Visible">
      <div slot="header" class="clearfix">
        <span style="font-weight:bold;">
          天气 ^v^
        </span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="card2Visible = false">X</el-button>
      </div>
      <div v-for="item in computeDialogMsg" :key="item.id" class="text item">
        {{ item.msg }} 
      </div>
    </el-card>
    <!-- 登录表单 -->
    <el-form ref="form" :model="loginForm" class="login-container">
      <h3 class="login-title">系统登录</h3>
      <el-form-item>
        <el-input type="text" auto-complete="false" 
          v-model="loginForm.username" placeholder="请输入用户名" 
          prefix-icon="iconfont el-icon-user"
          @focus="changeImages(2)"
          @blur="recoverImages">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" auto-complete="false" 
          v-model="loginForm.password" placeholder="请输入密码" 
          prefix-icon="iconfont el-icon-caret-right"
          @focus="changeImages(3)"
          @blur="recoverImages">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="text" 
          auto-complete="false" 
          v-model="loginForm.code" 
          placeholder="点击图片切换验证码"
          style="width:230px;margin-right:5px"
          suffix-icon="iconfont el-icon-arrow-right"
          @focus="changeImages(2)"
          @blur="recoverImages"
          @keyup.enter.native="submitLogin">
        </el-input>
        <img :src="code.pic" class="img-code" alt="切换验证码" @click="getCode">
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" class="login-rememberme">记住密码</el-checkbox>
      <el-button type="primary" style="width:100%" @click="submitLogin">登录</el-button>
    </el-form>
    <!-- 走马灯 —— 注意事项 -->
    <div class="block">
      <span class="demonstration" style="font-weight:bold;">【NOTICE】</span>
      <el-carousel trigger="click" height="100px">
        <el-carousel-item v-for="item in notices" :key="item.id" style="white-space: pre-wrap;">
          <h4 class="small">{{ item.msg }}</h4>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data(){
    return{
      // 登录信息
      loginForm:{
        username:'admin',
        password:'123',
        rememberMe:false,
        code:'',
      },
      // 验证码图片 URL
      code:{
        pic:'',
        realCode:'',
      },
      // 表情图
      loginSrc:require("@/assets/login1.jpg"),
      // 天气
      weathers:{
        ads:'',
        temp:'',
        weather:'',
        windDirection:'',
        windPower:'',
      },
      // 对话框提示内容
      dialogMsg:[],
      // 地址
      addressAndIp:{
        city:'南京市',
        ip:'127.0.0.1',
      },
      // 卡片的显示隐藏
      card1Visible:true,
      card2Visible:true,
      // 注意事项
      notices:[
        { id:1,
          msg:"本系统仅支持管理员和超级用户登录 ~ \n\n" +
              "若需超级用户账号，请联系管理员~"  
        },
        { id:2,
          msg:"管理员：孔傅宁  \n\n" +
              "QQ : 1114638323"  
        },
      ],
    }
  },
  created(){
    // 这样写一个页面同时异步调用三个接口，会造成接口调用失效，只能成功一个
    // this.getIp();
    // this.getCode()
    // this.getWeather();
    
    // 采用定时器，每隔0.1秒顺序执行三个接口调用函数
    this.getCode().then(res=>{
      let timer = setTimeout(() => {
        // 获取到验证码0.05秒后，再去获取ip信息
        this.getIp().then(res=>{
          let timer = setTimeout(() => {
          // 获取到ip信息0.05秒后，再去获取天气信息
          this.getWeather();
          }, 50)
        });
      }, 50)
    })
  },
  // 使用计算属性去赋值天气数据
  computed:{
    computeDialogMsg(){
      return this.dialogMsg = [
        { id:1,msg:"您所在城市："+ this.weathers.ads } ,
        { id:2,msg:"当前温度：" + this.weathers.temp } ,
        { id:3,msg:"当前天气：" + this.weathers.weather } ,
        { id:4,msg:"当前风向：" + this.weathers.windDirection } ,
        { id:5,msg:"当前风力：" + this.weathers.windPower } ,
        { id:6,msg:'祝您度过美好的一天~' } ,
      ]
    }
  },
  methods:{
    // 从免费接口获取验证码
    async getCode(){
      // https://www.mxnzp.com/api/verifycode/code
      // ?len=5&type=0&app_id=1hdz9pgxivhkldbj&app_secret=Y0Mrd0l0azRBdVlrZlI3eVhWRUtkQT09
      const {data:res} = await this.$ajax.get('api/verifycode/code',
        {
          params:{
            len:4,
            type:0,
            app_id:'1hdz9pgxivhkldbj',
            app_secret:'Y0Mrd0l0azRBdVlrZlI3eVhWRUtkQT09'
          }
        }
      )
      console.log(res)
      if(res.code !== 1) return this.$message.error('验证码获取失败！请刷新页面！')
      this.code.pic = res.data.verifyCodeImgUrl
      this.code.realCode = res.data.verifyCode
    },

    // 从免费接口获取天气信息
    async getWeather(){
      // https://www.mxnzp.com/api/weather/current/南京市
      // ?app_id=1hdz9pgxivhkldbj&app_secret=Y0Mrd0l0azRBdVlrZlI3eVhWRUtkQT09
      const {data:res} = await this.$ajax.get('api/weather/current/'+ this.addressAndIp.city,
        {
          params:{
            app_id:'1hdz9pgxivhkldbj',
            app_secret:'Y0Mrd0l0azRBdVlrZlI3eVhWRUtkQT09'
          }
        }
      )
      if(res.code !== 1) return this.$message.error('天气数据获取失败！')
      this.weathers.ads = res.data.address
      this.weathers.temp = res.data.temp
      this.weathers.weather = res.data.weather
      this.weathers.windDirection = res.data.windDirection
      this.weathers.windPower = res.data.windPower
      console.log(res)
    },

    // 从免费接口获取访问者的ip地址
    // https://www.mxnzp.com/api/ip/self
    // ?app_id=1hdz9pgxivhkldbj&app_secret=Y0Mrd0l0azRBdVlrZlI3eVhWRUtkQT09
    async getIp(){
      if(this.addressAndIp.city !== '南京市'){
        const {data:res} = await this.$ajax.get('api/ip/self',
          {
            params:{
              app_id:'1hdz9pgxivhkldbj',
              app_secret:'Y0Mrd0l0azRBdVlrZlI3eVhWRUtkQT09'
            }
          }
        )
        if(res.code !== 1) return this.$message.error('IP数据获取失败！')
        // 拿到访问者city 和 ip
        this.addressAndIp.city = res.data.city
        this.addressAndIp.ip = res.data.ip
      }
    },  

    // 点击了登录按钮
    submitLogin(){
      // 判断用户名和密码是否正确
      if(this.loginForm.username === 'admin' && this.loginForm.password === '123'){
        // 正确，继续判断验证码是否正确
        if(!this.loginForm.code || this.loginForm.code.toUpperCase() !== this.code.realCode.toUpperCase()){
          return this.$message.error('验证码错误！')
        }
        return this.$message.success('登录成功！')
      }
      // 用户名或密码不正确
      return this.$message.error('用户名或密码错误！')
    },

    // 表情图切换
    changeImages(index){
      if(index === 2){
        this.loginSrc = require("@/assets/login2.jpg");
      }
      if(index === 3) {
        this.loginSrc = require("@/assets/login3.jpg");
      }
    },

    //失去焦点时恢复第一张图片
    recoverImages() {
      this.loginSrc = require("@/assets/login1.jpg");
    },
  },
}
</script>

<style lang="less" scoped>
.login-container{
  border-radius: 15px;
  background-clip: padding-box;
  margin:180px auto;
  width:350px;
  padding:15px 35px 15px 35px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login-title{
  margin: 0px auto 40px auto;
  text-align: center;
}
.login-rememberme{
  text-align: left;
  margin: 0px 0px 15px 0px;
}
.img-code{
  position: absolute;
  width:100px;
  cursor:pointer;
  height:40px;
  border-radius: 5px;
}
.login-background{
  position:fixed;
  top:0;
  width:100%;
  height: 100%;
  z-index: -1;
}
.loginImages {
  position: absolute;
  top: 65px;
  left: 44%;
  width: 180px;
  z-index: 999;
}
.box-card1{
  position: absolute;
  top: 12%;
  left: 50px;
  width: 350px;
  z-index: 999;
  background-color: transparent;
}
.box-card2{
  position: absolute;
  top: 32%;
  left: 50px;
  width: 350px;
  z-index: 999;
  background-color: transparent;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.block{
  position: absolute;
  top: 12%;
  right: 50px;
  width: 350px;
  z-index: 999;
  background-color: transparent;
}
</style>