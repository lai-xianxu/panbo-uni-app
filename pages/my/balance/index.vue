<template>
  <nav-bar-page class="pb-page">
    <view class="balance fss-c">
      <view class="balance-card">
        <view class="balance-card-top fsbc">
          <view class="balance-card-content-title">可用余额（元）</view>
          <view class="balance-card-content-title">冻结金额（元）</view>
        </view>

        <view class="balance-card-center fsbc">
          <number-view :number="balanceData.availableBalance" defaultValue />
          <number-view :number="balanceData.freezeBalance" />
        </view>

        <view class="balance-card-line"></view>

        <view class="balance-card-bottom fsbc">
          <view class="balance-card-bottom-title">本月工资（元）</view>
          <view
            class="balance-card-bottom-title"
            @click.stop="route('pages/my/balance/base-detail/index')"
            >{{ realityWages }} ></view
          >
        </view>
      </view>

      <tab
        :list="tabList"
        v-model="active"
        class="tab-class"
        @onTabChange="onTabChange"
      />

      <view v-if="balanceList.length" class="tab-card">
        <scroll-view
          style="height: 100%"
          scroll-y="true"
          lower-threshold="20"
          @scrolltolower="getChangeDetailList"
        >
          <template v-if="balanceList?.length">
            <view
              class="tab-card-itme"
              v-for="item in balanceList"
              :key="item.id"
              @click.stop="
                route('pages/my/balance/billing-detail/index', { id: item.id })
              "
            >
              <view class="fsbc">
                <view class="card-itme-head-left">{{ item.notes }}</view>
                <view class="card-itme-head-right">{{ item.amount }}</view>
              </view>
              <view class="fsbc">
                <view class="card-item-time">{{ item.createTime }}</view>
                <view v-if="false" class="card-item-time"
                  >可提现日期2023-07-23</view
                >
                <vie class="card-item-time"
                  >交易状态：{{
                    transactionStatusMap[`${item.transactionStatus}`]
                  }}</vie
                >
              </view>
              <view class="card-item-line"></view>
            </view>
            <!-- <HistoricalRecordList :list="list" @onRenewList="onRenewList" /> -->
          </template>
          <uv-load-more style="padding: 20rpx 0" :status="status" />
        </scroll-view>
      </view>
      <empty
        v-else
        :text="`${tabList.find((e) => e.id == active)?.name || ''}列表为空`"
      />

      <view class="footer fsbc">
        <uv-button
          :throttleTime="300"
          shape="square"
          text="提现到银行卡"
          style="margin-right: 24rpx; flex: 1"
          @click="onWithdraw"
        ></uv-button>
        <uv-button
          :throttleTime="300"
          shape="square"
          text="定期存入"
          style="flex: 1"
          @click="
            route('pages/my/balance/deposit/index', { type: 'periodical' })
          "
        ></uv-button>
      </view>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import {
  appGetPbBalanceChangeDetailList,
  appGetMonthWages,
  appPdUserCardList,
} from '@/api/my';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onLoad((params) => {
  active.value = params.type || '';
  getMonthWages();
  getChangeDetailList();
  getPdUserCardList();
});

const transactionStatusMap = {
  '-1': '失败',
  0: '审核中',
  1: '等待打款',
  100: '完成',
};

// tab栏
const active = ref('');
const tabList = ref([
  {
    name: '全部',
    id: '',
  },
  {
    name: '转入',
    id: '400',
  },
  {
    name: '提现',
    id: '100',
  },
  {
    name: '收益',
    id: '700',
  },
]);
const onTabChange = () => {
  onRenewList();
};

// 获取余额
const balanceData = computed(() => userStore.getters_balance_data);
const realityWages = ref('');
const getMonthWages = async () => {
  const { result } = await appGetMonthWages();
  realityWages.value = result.realityWages || '0';
};

// 获取余额流水
const balanceList = ref([]);
const status = ref('loading');
let pageNo = 1;
let pageSize = 10;
const getChangeDetailList = async () => {
  if (status.value == 'nomore') return;
  if (pageNo == 1) {
    balanceList.value = [];
  }
  const { result } = await appGetPbBalanceChangeDetailList(
    {
      transactionType: active.value,
      pageNo,
      pageSize,
    },
    pageNo == 1
  );
  pageNo++;
  result?.records?.filter((e) => (e.amount = Number(e.amount).toFixed(2)));
  balanceList.value = [...balanceList.value, ...(result?.records || [])];
  if ((result?.records || []).length < pageSize) {
    status.value = 'nomore';
  }
};

const onRenewList = () => {
  pageNo = 1;
  status.value = 'loading';
  getChangeDetailList();
};

// 获取银行卡
const pdCardLen = ref(0);
const getPdUserCardList = async () => {
  const { result } = await appPdUserCardList();
  pdCardLen.value = result.pdUserCardDtoList?.length || 0;
  console.log('pdCardLen.value :', pdCardLen.value);
};

// 提现
const onWithdraw = () => {
  if (pdCardLen.value <= 0) {
    uni.$uv.toast('请先绑定银行卡');
    return;
  }
  route('pages/my/balance/deposit/index', { type: 'withdraw' });
};
</script>

<style scoped lang="scss">
.balance {
  position: relative;
  width: 100%;
  height: 100%;
  .balance-card {
    background: url('@/static/my/balance-bg.png') no-repeat;
    background-size: 100%;
    width: 100%;
    height: 294rpx;
    padding: 50rpx 40rpx;
    .balance-card-top {
      padding: 0 80rpx 0 40rpx;
      .balance-card-content-title {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #ffffff;
      }
    }
    .balance-card-center {
      padding: 0 50rpx 0 50rpx;
      margin-top: 30rpx;
    }
    .balance-card-line {
      width: 100%;
      height: 1rpx;
      background: #ffffff;
      border-radius: 1rpx;
      margin-top: 30rpx;
    }

    .balance-card-bottom {
      padding: 0 50rpx 0 50rpx;
      margin-top: 30rpx;
      font-size: 28rpx;
      line-height: 28rpx;
      color: #ffffff;
    }
  }
  .tab-class {
    margin: 30rpx 0;
  }
  .tab-card {
    width: 100%;
    flex: 1;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 8rpx 0rpx rgba(12, 100, 127, 0.3);
    margin-bottom: 140rpx;
    padding: 30rpx;
    overflow: auto;
    .tab-card-itme {
      margin-bottom: 30rpx;
      .card-itme-head-left {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #333333;
      }
      .card-itme-head-right {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #333333;
      }
      .card-item-time {
        font-size: 24rpx;
        line-height: 24rpx;
        font-weight: 400;
        color: #777777;
        margin-top: 20rpx;
      }
      .card-item-line {
        width: 100%;
        height: 1rpx;
        background: #17bcef;
        border-radius: 1rpx;
        margin-top: 30rpx;
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 30rpx;
    left: 0;
    width: 100%;
    padding: 0 30rpx;
  }
}
:deep() {
  .uv-button {
    width: 100% !important;
  }
}
</style>
