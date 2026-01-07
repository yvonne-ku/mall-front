<template>
  <div class="login v2">
    <div class="wrapper">
      <div
        class="dialog dialog-shadow"
        style="display: block; margin-top: -362px"
      >
        <div class="title">
          <h4>Mall 账号登录</h4>
        </div>
        <div v-if="loginPage" class="content">
          <ul class="common-form">
            <li class="username border-1p">
              <div class="input">
                <input
                  type="text"
                  v-model="ruleForm.username"
                  placeholder="用户名"
                />
              </div>
            </li>
            <li>
              <div class="input">
                <input
                  type="password"
                  v-model="ruleForm.password"
                  @keyup.enter="login"
                  placeholder="密码"
                />
              </div>
            </li>
            <li>
              <div id="captcha">
                <p id="wait">正在加载验证码...</p>
              </div>
            </li>
            <li style="text-align: right" class="pr">
              <el-checkbox class="auto-login" v-model="autoLogin"
                >记住密码</el-checkbox
              >
              <!-- <span class="pa" style="top: 0;left: 0;color: #d44d44">{{ruleForm.errMsg}}</span> -->
              <a href="javascript:;" class="register" @click="toRegister"
                >注册账号</a
              >
              <a
                style="padding: 1px 0 0 10px"
                @click="
                  open(
                    '找回密码',
                    '这个还没做'
                  )
                "
                >忘记密码</a
              >
            </li>
          </ul>
          <!--登录-->
          <div style="margin-top: 25px">
            <y-button
              :text="logintxt"
              :classStyle="
                ruleForm.password && ruleForm.username && logintxt === '登录'
                  ? 'main-btn'
                  : 'disabled-btn'
              "
              @btnClick="login"
              style="
                margin: 0;
                width: 100%;
                height: 48px;
                font-size: 18px;
                line-height: 48px;
              "
            ></y-button>
          </div>
          <div>
            <y-button
              text="返回"
              @btnClick="login_back"
              style="
                margintop: 10px;
                marginbottom: 15px;
                width: 100%;
                height: 48px;
                font-size: 18px;
                line-height: 48px;
              "
            >
            </y-button>
          </div>
          <div class="border"></div>
          <div class="footer">
            <div class="other">其它账号登录：</div>
            <a
              ><img
                @click="open('待开发', '此功能开发中...')"
                style="height: 15px; margin-top: 22px"
                src="@/assets/images/other-login.png"
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import YFooter from "@common/footer";
import YButton from "@components/YButton";
import { userLogin, geetest } from "@api/customer.js";
import { addCart } from "@api/goods.js";
import { setStore, getStore, removeStore } from "@utils/storage.js";
var captcha;
var captchaValidate;
export default {
  data() {
    return {
      cart: [],
      loginPage: true,
      ruleForm: {
        username: "",
        password: "",
        errMsg: "",
      },
      registered: {
        username: "",
        password: "",
        password2: "",
        errMsg: "",
      },
      autoLogin: false,
      logintxt: "登录",
      statusKey: "",
    };
  },
  computed: {
    count() {
      return this.$store.state.login;
    },
  },
  methods: {
    open(t, m) {
      this.$notify.info({
        title: t,
        message: m,
      });
    },
    messageSuccess(m) {
      this.$message({
        message: m,
        type: "success",
      });
    },
    message(m) {
      this.$message.error({
        message: m,
      });
    },
    getRemembered() {
      var judge = getStore("remember");
      if (judge === "true") {
        this.autoLogin = true;
        this.ruleForm.username = getStore("rusername");
        this.ruleForm.password = getStore("rpassword");
      }
    },
    rememberPass() {
      if (this.autoLogin === true) {
        setStore("remember", "true");
        setStore("rusername", this.ruleForm.username);
        setStore("rpassword", this.ruleForm.password);
      } else {
        setStore("remember", "false");
        removeStore("rusername");
        removeStore("rpassword");
      }
    },
    toRegister() {
      this.$router.push({
        path: "/register",
      });
    },
    // 登录返回按钮
    login_back() {
      this.$router.go(-1);
    },
    // 登陆时将本地的添加到用户购物车
    login_addCart() {
      let cartArr = [];
      let localCart = JSON.parse(getStore("buyCart"));
      if (localCart && localCart.length) {
        localCart.forEach((item) => {
          cartArr.push({
            userId: getStore("userId"),
            productId: item.productId,
            productNum: item.productNum,
          });
        });
      }
      this.cart = cartArr;
    },
    login() {
      this.logintxt = "登录中...";
      this.rememberPass();
      if (!this.ruleForm.username || !this.ruleForm.password) {
        this.message("用户名或者密码不能为空!");
        return false;
      }
      if (!captchaValidate) {
        this.message("请完成验证");
        this.logintxt = "登录";
        return false;
      }
      userLogin({
        type: "username",
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        captchaId: captchaValidate.captcha_id,
        captchaOutput: captchaValidate.captcha_output,
        genTime: captchaValidate.gen_time,
        lotNumber: captchaValidate.lot_number,
        passToken: captchaValidate.pass_token
      }).then((res) => {
        if (res.result.state === 1) {
          setStore("token", res.result.token);
          setStore("userId", res.result.id);
          // 登录后添加当前缓存中的购物车
          if (this.cart.length) {
            for (var i = 0; i < this.cart.length; i++) {
              addCart(this.cart[i]).then((res) => {
                if (res.success === true) {
                }
              });
            }
            removeStore("buyCart");
            this.$router.push({
              path: "/",
            });
          } else {
            this.$router.push({
              path: "/",
            });
          }
        } else {
          this.logintxt = "登录";
          this.message("登录失败");
          captcha.reset();
          return false;
        }
      });
    },
    init_geetest() {
      window.initGeetest4({
        captchaId: '6cfa0f940dfdf09f94df903f4a5fb077',  // 你的业务ID
        product: "popup",          // 展现形式：'popup'(弹出), 'float'(浮动), 'bind'(结合按钮)
        nativeButton: {
          width: '100%',  // 使按钮的宽度与其父元素的宽度一致
          height: '50px'  // 高度可以根据你的输入框高度调整
        }
      },(captchaObj) => {
        captcha = captchaObj;             // 返回验证码对象，将验证码对象赋值给全局变量 captcha，二次验证时（点击登录按钮时）返回给后端
        captchaObj.appendTo("#captcha");  // 将验证码对象添加到指定容器，在 UI 上展示验证码
        captchaObj.onSuccess(() => {
          // 用户已经完成了验证操作，且通过了极验的算法检测，返回验证成功凭证
          captchaValidate = captchaObj.getValidate();
          console.log(captchaValidate)
        });
        captchaObj.onReady(() => {
          // 验证码 UI 加载完成后，隐藏加载状态
          document.getElementById("wait").style.display = "none";
        });
        captchaObj.onError((err) => {
          // 验证码 UI 加载错误
          console.error("验证码加载错误:", err);
        });
      })
    },
  },
  mounted() {
    this.getRemembered();
    this.login_addCart();
    this.init_geetest();
  },
  components: {
    YFooter,
    YButton,
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
* {
  box-sizing: content-box;
}

.login {
  overflow-x: hidden;
  overflow-y: hidden;
  .input {
    height: 50px;
    display: flex;
    align-items: center;
    input {
      font-size: 16px;
      width: 100%;
      height: 100%;
      padding: 10px 15px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  }
  .wrapper {
    background: url(@/assets/images/bg_9b9dcb65ff.png) repeat;
    background-size: 100px;
    min-height: 800px;
    min-width: 630px;
  }
}

.v2 .dialog {
  width: 450px;
  border: 1px solid #dadada;
  border-radius: 10px;
  top: 50%;
  left: 50%;
  margin-left: -225px;
  position: absolute;
  .title {
    background: linear-gradient(#fff, #f5f5f5);
    height: auto;
    overflow: visible;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    position: relative;
    background-image: url(@/assets/images/C.png);
    background-size: 110px;
    background-position: top center;
    background-repeat: no-repeat;
    height: 92px;
    margin: 23px 0 30px;
    padding: 65px 0 0;
    box-shadow: none;
    h4 {
      padding: 0;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      font-weight: 700;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      margin: 0;
      padding: 0;
      border-bottom: 0;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      line-height: 1em;
      height: auto;
      color: #333;
      font-weight: 400;
    }
  }
  .content {
    padding: 0 40px 22px;
    height: auto;
    .common-form {
      li {
        clear: both;
        margin-bottom: 15px;
        position: relative;
      }
    }
  }
}

.dialog-shadow,
.v2 .bbs .dialog-shadow,
.v2 .dialog-shadow {
  -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
}

@media screen and (min-width: 737px),
  screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
  .wrapper {
    background: url(@/assets/images/con-bg_04f25dbf8e.jpg) repeat-x;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .dialog {
    background: url(@/assets/images/dialog-gray-bg.png) #fff bottom repeat-x;
    border-radius: 12px;
    display: none;
    margin: -163px 0 0 -218px;
    width: 436px;
    position: fixed;
    left: 50%;
    top: 50%;
  }
  .dialog .title h4 {
    border-bottom: #d1d1d1 solid 1px;
    box-shadow: 0 2px 6px #d1d1d1;
    color: #666;
    font-size: 20px;
    height: 61px;
    line-height: 61px;
    padding: 0 0 0 35px;
  }
  .common-form li {
    clear: both;
    margin-bottom: 15px;
    position: relative;
  }
  .auto-login {
    position: absolute;
    top: 0px;
    left: 2px;
    color: #999;
  }
  .register {
    padding: 1px 10px 0;
    border-right: 1px solid #ccc;
  }
  .border {
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
  }
  .other {
    margin: 20px 5px 0 0;
    width: auto;
    color: #bbb;
    font-size: 12px;
    cursor: default;
    color: #999;
  }
  .footer {
    display: flex;
    flex-direction: row;
  }
  .agree {
    margin-bottom: 30px;
    color: #999;
  }
}

.registered {
  h4 {
    padding: 0;
    text-align: center;
    color: #666;
    border-bottom: 1px solid #dcdcdc;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    font-weight: 700;
    font-size: 20px;
    height: 60px;
    line-height: 60px;
  }
}

#wait {
  text-align: left;
  color: #999;
  margin: 0;
}
</style>
