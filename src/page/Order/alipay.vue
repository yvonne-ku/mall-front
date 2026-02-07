<template>
  <div class="w" style="padding-bottom: 100px;">
    <y-shelf title="XPay 收银台 收款方: yvonneku">
      <div slot="content">
        <div class="box-inner order-info">
          <p class="payment-detail">扫一扫付款（元）</p>
          <p class="payment-money">{{orderTotal}}</p>
          <div class="img-box">
            <img id="qr" class="pic" v-bind:src="imgPath" alt="加载失败" width="168px" height="168px"/>
            <div class="explain">
              <img class="fn-left" src="https://t.alipayobjects.com/images/T1bdtfXfdiXXXXXXXX.png" alt="扫一扫标识">
              <div class="fn-right">打开手机支付宝<br>扫一扫继续付款</div>
              <div class="timeout" v-if="timeout">二维码已过期</div>
            </div>
          </div>
          <a class="download-alipay" href="https://mobile.alipay.com/index.htm" target="_blank">首次使用请下载手机支付宝</a>
          <div class="count">{{timecount}}</div>

          <div class="qrguide-area">
            <img src="https://t.alipayobjects.com/images/rmsweb/T13CpgXf8mXXXXXXXX.png" :class="show?'show-img':'close-img'" @click="changePic()">
            <img src="https://t.alipayobjects.com/images/rmsweb/T1ASFgXdtnXXXXXXXX.png" :class="show?'close-img':'show-img'" @click="changePic()">
          </div>
        </div>

        <div>
          <div class="box-btn">
            <div>
              <span>
              
              </span>
              <em><span>¥</span>{{orderTotal}}</em>
              <y-button :text="paytxt"
                        classStyle="disabled-btn"
                        style="width: 120px;height: 40px;font-size: 16px;line-height: 38px"
                        @btnClick="paySuc()"
              ></y-button>
            </div>
          </div>
        </div>

      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '@components/shelf'
  import YButton from '@components/YButton'
  import { getStore, setStore } from '@utils/storage'
  import { checkPaymentStatus, pay } from "@/api";
  export default {
    data () {
      return {
        show: true,
        userId: '',
        orderTotal: '',
        userName: '',
        tel: '',
        streetName: '',
        checkPrice: '',
        paytxt: '等待支付...',
        nickName: '',
        money: '',
        info: '',
        email: '',
        isCustom: 0,
        imgPath: '/qr/alipay/custom.png',
        picName: '',
        timeout: false,
        polling: null,
      }
    },
    computed: {
    },
    methods: {
      changePic () {
        this.show = !this.show
      },
      toMoney (num) {
        num = parseFloat(num)
        num = num.toFixed(2)
        num = num.toLocaleString()
        return num
      },
      paySuc () {

      },
      _checkPaymentStatus() {
        checkPaymentStatus({ params: { orderSn: this.orderId }
        }).then((res) => {
          if (res.success === true) {
            let status = res.result.status
            if (res.result.status === 'TRADE_CLOSED') {
              this.paytxt = "交易已超时关闭"
              this.stopPolling()
            } else if (res.result.status === 'TRADE_SUCCESS' || res.result.status === 'TRADE_FINISHED') {
              this.paytxt = "交易成功，正在跳转中..."
              this.$router.push({path: '/order/paysuccess', query: { price: this.orderTotal }})
            }
          }
        })
      }
    },
    stopPolling() {
      if (this.polling) {
        clearInterval(this.polling)
        this.polling = null
      }
    },
    mounted () {
      let price = getStore('price')
      let isCustom = getStore('isCustom')
      let qrCode = getStore('qrCode')
      this.orderId = this.$route.query.orderId
      this.orderTotal = this.toMoney(price)
      if (this.orderTotal === 'NaN') {
        this.$router.push({path: '/'})
      }
      this.picName = this.orderTotal
      this.imgPath = qrCode

      // 每 3 秒查询一次，订单支付状态
      this.polling = setInterval(() => {
        this._checkPaymentStatus()
      },3000)
    },
    beforeDestroy() {
      this.stopPolling()
    },
    components: {
      YShelf,
      YButton
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  .w {
    padding-top: 39px;
  }

  .order-info {
    padding: 60px 0 55px;
    color: #333;
    background: #fff !important;
    h3 {
      padding-bottom: 14px;
      line-height: 36px;
      text-align: center;
      font-size: 36px;
      color: #212121;
    }
    .payment-detail {
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #999;
    }
  }

  .box-inner {
    line-height: 60px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;
    > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
    em {
      margin-left: 5px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
      margin-right: 20px;
      span {
        margin-right: 4px;
        font-size: 16px;
      }
    }
  }

  .box-btn {
    line-height: 60px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
    em {
      margin-left: 5px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
      margin-right: 20px;
      span {
        margin-right: 4px;
        font-size: 16px;
      }
    }
  }

  .payment-money {
    text-align: center;
    font-size: 30px;
    color: #d44d44;
    font-weight: 700;
  }

  .img-box{
    position: relative;
    width: 180px;
    height: auto;
    min-height: 168px;
    margin: 0 auto;
    padding: 6px;
    border: 1px solid #d3d3d3;
    box-shadow: 1px 1px 1px #ccc;
    display: inline-block;
  }

  .explain {
    margin: 5px 0 12px 0;
  }

  .pic{
    margin-top: 3px;
  }

  .fn-left{
    margin-left: -5px;
  }

  .fn-right{
    font-size: 13px;
    color: #4D4D4D;
    line-height: 18px;
    margin: -57px 0 0 33px;
  }

  .download-alipay {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-top: -5px;
    font-size: 12px;
    color: #a6a6a6;
    text-decoration: underline;
    width: 25%;
    margin: 0 auto;
  }

  .qrguide-area {
    position: absolute;
    top: 113px;
    left: 713px;
    width: 204px;
    height: 183px;
    cursor: pointer;
  }

  .show-img{
    display: block;
  }

  .close-img{
    display: none;
  }

  .red {
    position: absolute;
    top: 482px;
    left: 1151px;
    width: 47px;
    height: 50px;
    cursor: pointer;
  }

  .el-dialog--small {
    width: 30%;
  }

  .qr-red {
    display: block;
    margin: 0 auto;
    width: 70%;
  }

  .count {
    display: flex;
    position: absolute;
    text-align: center;
    width: 230px;
    flex-direction: column;
    align-items: center;
    margin-left: calc(50% - 115px);
    margin-top: 0px;
    color: #222;
    margin-top: -18px;
  }
  
  .timeout{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(255,255,255,.95);
    color: #222;
    line-height: 200px;
    text-align: center;
    z-index: 1;
  }
</style>
