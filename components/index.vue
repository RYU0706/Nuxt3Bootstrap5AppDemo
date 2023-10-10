<template>
  <div>
    <table>
      <thead>
        <tr>
          <th colspan="7">
            <div class="navigation">
              <button @click="prevMonth">前の月</button>
              <span>{{ monthName }} {{ year }}</span>
              <button @click="nextMonth">次の月</button>
            </div>
          </th>
        </tr>
        <tr>
          <th>日</th>
          <th>月</th>
          <th>火</th>
          <th>水</th>
          <th>木</th>
          <th>金</th>
          <th>土</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks" :key="week.id">
          <td v-for="day in week.days" :key="day.date">
            <h4 class="day">{{ day.date }}</h4>
            <ul v-if="day.events.length">
              <li v-for="event in day.events" :key="event.id">{{ event.name }} ({{ event.type }})</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="fixed-bottom-right" id="buttonContainer">
      <button @click="openAddEvent">予定を追加</button>
      <button @click="showSalaryInfo">給与確認</button>
    </div>
    <div class="fixed-bottom-left" id="buttonContainer">
      <button>固定シフト</button>
      <button @click="openAddWork">バイト先登録</button>
      <button>設定</button>
    </div>

    <div v-if="showAddEventOverlay" class="overlay"></div>

    <div v-if="showAddWorkOverlay" class="overlay"></div>

    <div v-if="showSalaryInfoOverlay" class="overlay"></div>

    <div v-if="showOverlay" class="overlay"></div>
  </div>
</template>
<style>
/* スタイルの例 */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f5f5f5;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.buttonContainer {
  display: flex;
  gap: 10px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.fixed-bottom-right {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.fixed-bottom-left {
  position: fixed;
  bottom: 20px;
  left: 20px;
}
</style>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      weeks: [], // 週ごとのデータを格納する配列
      showAddEventOverlay: false,
      showAddWorkOverlay: false,
      showSalaryInfoOverlay: false,
      showOverlay: false,
    };
  },
  computed: {
    monthName() {
      const monthNames = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      return monthNames[this.month];
    }
  },
  methods: {
    prevMonth() {
      if (this.month === 1) {
        this.year -= 1;
        this.month = 12;
      } else {
        this.month -= 1;
      }
      this.generateCalendar();
    },
    nextMonth() {
      if (this.month === 12) {
        this.year += 1;
        this.month = 1;
      } else {
        this.month += 1;
      }
      this.generateCalendar();
    },
    generateCalendar() {
      this.weeks = []; // 週のデータを初期化

      const firstDay = new Date(this.year, this.month - 1, 1).getDay();
      const daysInMonth = new Date(this.year, this.month, 0).getDate();
      const daysInPreviousMonth = new Date(this.year, this.month - 1, 0).getDate();

      let days = [];
      for (let i = 1 - firstDay; i <= daysInMonth; i++) {
        if (i > 0) {
          days.push({ date: i, events: [] });
        } else {
          days.push({ date: daysInPreviousMonth + i, events: [] });
        }

        if (days.length === 7 || i === daysInMonth) {
          this.weeks.push({ id: this.weeks.length + 1, days: days });
          days = [];
        }
      }
    },
    showEvents(day) {
      // 日付をクリックしたときのイベントを表示するロジック
      // イベントのリスト要素を表示する
      // イベントのリスト要素に、イベントの情報を表示する
    },
    openAddEvent() {
      this.showAddEventOverlay = true;
    },
    closeAddEvent() {
      this.showAddEventOverlay = false;
    },
    openAddWork() {
      this.showAddWorkOverlay = true;
    },
    closeAddWork() {
      this.showAddWorkOverlay = false;
    },
    showSalaryInfo() {
      this.showSalaryInfoOverlay = true;
    },
    closeSalaryInfo() {
      this.showSalaryInfoOverlay = false;
    },
  },
  created() {
    this.generateCalendar();
  },
};
</script>
