<template>
  <div class="login v2">
    <div class="wrapper">
      <div
        class="dialog dialog-shadow"
        style="display: block; margin-top: -362px"
      >
        <div class="registered">
          <h4>Mall 账号注册</h4>
          <div class="content" style="margin-top: 20px">
            <ul class="common-form">
              <!-- 第一行：手机号 -->
              <li class="phone border-1p">
                <div style="margin-top: 40px" class="input">
                  <input
                      type="tel"
                      v-model="registered.phone"
                      placeholder="请输入手机号"
                      maxlength="11"
                      @input="validatePhone"
                  />
                </div>
              </li>

              <!-- 第二行：验证码 -->
              <li>
                <div class="input" style="display: flex; gap: 10px;">
                  <input
                      type="text"
                      v-model="registered.verifyCode"
                      placeholder="请输入验证码"
                      maxlength="6"
                      style="flex: 1; min-width: 250px;"
                  />
                  <y-button
                      :text="codeButtonText"
                      :classStyle="canSendCode ? 'main-btn' : 'disabled-btn'"
                      @btnClick="sendVerifyCode"
                      style="
                        min-width: 100px;
                        height: 50px;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;"
                  >
                  </y-button>
                </div>
              </li>

              <!-- 第三行：用户名 -->
              <li>
                <div class="input">
                  <input
                      type="text"
                      v-model="registered.username"
                      placeholder="请输入用户名"
                      @keyup="
                      registered.username = registered.username.replace(
                        /[^\w\.\/]/gi,
                        ''
                      )
                    "
                  />
                </div>
              </li>

              <!-- 第四行：密码 -->
              <li>
                <div class="input">
                  <input
                      type="password"
                      v-model="registered.password"
                      placeholder="请输入密码"
                  />
                </div>
              </li>

              <!-- 第五行：确认密码 -->
              <li>
                <div class="input">
                  <input
                      type="password"
                      v-model="registered.password2"
                      placeholder="请再次输入密码"
                  />
                </div>
              </li>

              <!-- 极验验证码 -->
              <li>
                <div id="captcha">
                  <p id="wait">正在加载验证码...</p>
                </div>
              </li>
            </ul>
            <el-checkbox class="agree" v-model="agreement">
              我已阅读并同意遵守
              <a
                @click="
                  open(
                    '法律声明',
                    '此仅为个人练习开源模仿项目，仅供学习参考，承担不起任何法律问题'
                  )
                "
                >法律声明</a
              >
              和
              <a
                @click="
                  open(
                    '隐私条款',
                    '本网站将不会严格遵守有关法律法规和本隐私政策所载明的内容收集、使用您的信息'
                  )
                "
                >隐私条款</a
              >
            </el-checkbox>
            <div style="margin-bottom: 30px">
              <y-button
                :classStyle="
                  registered.password &&
                  registered.password2 &&
                  registered.username &&
                  registxt === '注册'
                    ? 'main-btn'
                    : 'disabled-btn'
                "
                :text="registxt"
                style="
                  margin: 0;
                  width: 100%;
                  height: 48px;
                  font-size: 18px;
                  line-height: 48px;
                "
                @btnClick="toRegister"
              >
              </y-button>
            </div>
            <div class="border" style="margin-bottom: 10px"></div>
            <ul class="common-form pr">
              <!-- <li class="pa" style="left: 0;top: 0;margin: 0;color: #d44d44">{{registered.errMsg}}</li> -->
              <li
                style="
                  text-align: center;
                  line-height: 48px;
                  margin-bottom: 0;
                  font-size: 12px;
                  color: #999;
                "
              >
                <span>如果您已拥有 Mall 账号，则可在此</span>
                <a href="javascript:;" style="margin: 0 5px" @click="toLogin"
                  >登陆</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import YFooter from "@common/footer";
import YButton from "@components/YButton";
import {register, geetest, sendSmsCode} from "@/api/customer.js";
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
        phone: "",
        verifyCode: "",
        username: "",
        password: "",
        password2: "",
        errMsg: "",
      },
      agreement: false,
      registxt: "注册",
      codeButtonText: "获取验证码",
      canSendCode: false,
      statusKey: "",
      countdown: 0,
      countdownTimer: null,
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
    toLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    toRegister() {
      this.registxt = "注册中...";
      let username = this.registered.username;
      let password = this.registered.password;
      let password2 = this.registered.password2;
      let phone = this.registered.phone;
      let phoneValidCode = this.registered.verifyCode;
      if (!username || !password || !password2) {
        this.message("用户名或密码不能为空!");
        this.registxt = "注册";
        return false;
      }
      if (password2 !== password) {
        this.message("两次输入的密码不相同!");
        this.registxt = "注册";
        return false;
      }
      if (!phone || !phoneValidCode) {
        this.message("手机号或验证码不能为空!");
        this.registxt = "注册";
        return false;
      }
      if (!this.agreement) {
        this.message("您未勾选同意我们的相关注册协议!");
        this.registxt = "注册";
        return false;
      }
      if (!result) {
        this.message("请完成验证");
        this.registxt = "注册";
        return false;
      }
      register({
        platform: "phone",
        username: username,
        password: password,
        phone: phone,
        phoneValidCode: phoneValidCode,
        captchaId: captchaValidate.captcha_id,
        captchaOutput: captchaValidate.captcha_output,
        genTime: captchaValidate.gen_time,
        lotNumber: captchaValidate.lot_number,
        passToken: captchaValidate.pass_token
      }).then((res) => {
        if (res.success === true) {
          this.messageSuccess("恭喜您，注册成功！赶紧登录体验吧");
          this.toLogin();
        } else {
          this.message(res.message);
          captcha.reset();
          this.registxt = "注册";
          return false;
        }
      });
    },
    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      this.canSendCode = phoneRegex.test(this.registered.phone);
    },
    startCountdown() {
      this.countdown = 60;
      this.codeButtonText = `${this.countdown}秒后重发`;
      this.canSendCode = false;

      this.countdownTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.codeButtonText = "发送验证码";
          this.canSendCode = true;
        } else {
          this.codeButtonText = `${this.countdown}秒后重发`;
        }
      }, 1000);
    },
    sendVerifyCode() {
      if (!this.canSendCode || this.countdown > 0) {
        return;
      }
      sendSmsCode({
        receiver: this.registered.phone,
        type: "register",
        platform: "phone",
      }).then((res) => {
        if (res.success === true) {
          this.messageSuccess("验证码发送成功");
          this.startCountdown();
        } else {
          this.message(res.msg || "验证码发送失败");
        }
      }).catch((error) => {
        this.message("验证码发送失败，请重试");
        console.error("发送验证码失败:", error);
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
    this.init_geetest();
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
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
    background-image: url(@/assets/images/smartisan_4ada7fecea.png);
    background-size: 140px;
    background-position: top center;
    background-repeat: no-repeat;
    height: 92px;
    margin: 23px 0 50px;
    padding: 75px 0 0;
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
