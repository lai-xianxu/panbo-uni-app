<template>
  <view class="social-con">
    <nav-bar />
    <view class="title title-suffix">商业保险信息</view>
    <render-card class="content" :list="list" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
const list = ref([
  {
    label: '投保人',
    value: '李凯',
  },
  {
    label: '性别',
    value: '男',
  },
  {
    label: '民族',
    value: '汉',
  },
  {
    label: '证件号码',
    value: '321199347723974845',
  },
  {
    label: '证件类型',
    value: '身份证',
  },
  {
    label: '联系电话',
    value: '1984849995454',
  },
  {
    label: '保险责任',
    value: '意外身故、伤残',
  },
  {
    label: '保险金额',
    value: '100000',
  },
  {
    label: '保险费',
    value: '￥13.26元',
  },
  {
    label: '保险期间',
    value: '自2023年08月21日零时起至2023年09月20日二十四时止',
  },
  {
    label: '特别约定',
    value:
      '1、本保险承保被保险人16-60周岁，从事1-4职业外卖快递除外) 的用户，如在出险时被保险人实际从事其他职业，保险人按对应保险金额*20%进行赔付，职业分类以众安职业类别表为准。因职业类别问题误投或错投本产品的，我司不承担赔付责任并全额退还保费。<br>2、本保险若被保险人因驾驶或乘坐机动车发生单车事故或因溺水导致身故或伤残，保险人仍按被保险投保的保障计划对应的保险金额承担保险责任。<br>3、本保险意外伤害医疗费用责任是指国内二级及以上公立医院实际发生的符合当地社会基本医疗保险规定的、可报销的、必需且合理的医疗费用，每次事故按90%进行赔付。<br>4、若为分期则: 本保单保费分期缴付，未缴付首期保费，保险合同不成立，保险人不承担保险责任。如投保人未按照保险合同约定的付款时间足额缴付当期保费，且在本保险合同约定的付款宽限期内仍未足额补缴当期保费的，本保险合同的保险期间在上一缴费周期结束时终止。对于保险期间终止后发生的保险事故，保险人不承担保险责任。本保险月缴宽限期7天，日缴宽限期1天，宽限期内未付清当期保费，保险人不承担自上一缴费周期结束次日零时起发生的保险事故。',
  },
]);
</script>

<style scoped lang="scss">
.social-con {
  padding: 0 0 50rpx;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.title {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 30rpx;
  padding-left: 30rpx;
}
.content {
  margin: 0 30rpx;
}
</style>
