<template>
  <div class="container">
    <form class="form margin-bottom">
      <label class="form-label">Группировка</label>
      <select v-model="groupBy" class="form-control form-select">
        <option value="pair">Валютная пара</option>
        <option value="project">Проект</option>
      </select>
    </form>

    <div class="row margin-bottom">
      <div class="col-md-4">
        <button class="btn btn-success">Добавить пару</button>
      </div>
      <div class="col-md-4">
        <button class="btn btn-primary">Обновить все курсы</button>
      </div>
      <div class="col-md-4">
        <button class="btn btn-secondary">Выгрузить</button>
      </div>
    </div>

    <div class="row margin-bottom">
        <div class="col-md-4">
          <label class="form-label">Проект</label>
          <select class="form-control form-select">
            <option>...Выберите проект</option>
            <option>МА1</option>
            <option>МА2</option>
            <option>АК</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Валютная пара</label>
          <select class="form-control form-select">
            <option>...Выберите пару</option>
            <option>EURBYN</option>
            <option>BYNRUB</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Источник</label>
          <select class="form-control form-select">
            <option>...Выберите источник</option>
            <option>Bloomberg</option>
            <option>Bloomberg</option>
            <option>Bloomberg</option>
          </select>
        </div>
    </div>

    <div v-if="groupBy === 'pair'" class="container">
      <table class="table table-striped table-bordered table-hover">
        <thead>
        <tr>
          <th rowspan="2">
            Валютная пара
          </th>
          <th rowspan="2">Источник</th>
          <th rowspan="2">Коэфф</th>
          <th rowspan="2">Курс</th>
          <th rowspan="2">Последнее обновление</th>
          <th rowspan="2">Режим</th>
          <th rowspan="2">Дата</th>
          <th rowspan="2">Пред Курс</th>
          <th colspan="2">
            Текущее отклонение
          </th>
          <th rowspan="2">Сигнал отклонения</th>
        </tr>
        <tr>
          <th>ед</th>
          <th>%</th>
        </tr>
        <tr v-for="item in pairModels">
          <td @click="openModal">{{ item.pair.basic }}{{ item.pair.quota }}</td>
          <td>{{ item.source }}</td>
          <td>{{ item.coefficient }}</td>
          <td>
            <div style="width: 150px;">
              <form class="row g-3">
                <div class="col-8">
                  <input type="text" class="form-control" :value="item.amount">
                </div>
                <div class="col-3">
                  <font-awesome-icon icon="check" class="pencil"/>
                </div>
              </form>
            </div>
          </td>
          <td>{{ item.updatedAt }}</td>
          <td>{{ item.mode }}</td>
          <td>{{ item.date }}</td>
          <td>{{ editable || item.lastAmount }}</td>
          <td>{{ item.change.absolute }}</td>
          <td>{{ item.change.percent }}</td>
          <td>
            <div style="width: 170px;">
              <form class="row g-3">
                <div class="col-6">
                  <select v-model="changeSignal[item.id]['use']" class="form-control form-select">
                    <option value="0">Нет</option>
                    <option value="1">Да</option>
                  </select>
                </div>
                <div class="col-6">
                  <input v-if="changeSignal[item.id]['use'] == 1" v-model="changeSignal[item.id]['value']" class="form-control"/>
                </div>
              </form>
            </div>
          </td>
        </tr>
        </thead>
      </table>
    </div>
    <table v-if="groupBy === 'project'">
      t2 --- {{ groupBy }}
    </table>
  </div>


  <div class="modal" v-if="modalVisible">
    <div class="row">
      <div class="col-md-10">
        <table class="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Проект</th>
              <th>Дата</th>
              <th>Валютная пара</th>
              <th>Источник</th>
              <th>Инд курс 1</th>
              <th>Инд курс 2</th>
              <th>Курс депозита</th>
              <th>Комиссия проекта</th>
              <th>Курс рук</th>
              <th>Финальный курс</th>
              <th> </th>
            </tr>

          </thead>
          <tbody>
          <tr>
            <td>МА1</td>
            <td>01.09.2024</td>
            <td>EURBYN</td>
            <td>Bloomberg</td>
            <td>100</td>
            <td>98</td>
            <td>105</td>
            <td>0.05</td>
            <td>120</td>
            <td>118</td>
            <td><font-awesome-icon icon="check" class="pencil" @click="closeModal" /></td>
          </tr>
          <tr>
            <td>АК</td>
            <td>01.09.2024</td>
            <td>EURBYN</td>
            <td>Bloomberg</td>
            <td>100</td>
            <td>98</td>
            <td>105</td>
            <td>0.05</td>
            <td>120</td>
            <td>118</td>
            <td><font-awesome-icon icon="check" class="pencil" @click="closeModal" /></td>
          </tr>
          <tr>
            <td>МА2</td>
            <td>01.09.2024</td>
            <td>EURBYN</td>
            <td>Bloomberg</td>
            <td>100</td>
            <td>98</td>
            <td>105</td>
            <td>0.05</td>
            <td>120</td>
            <td>118</td>
            <td><font-awesome-icon icon="check" class="pencil" @click="closeModal"/></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-2" @click="closeModal">X</div>
    </div>
  </div>
</template>

<script>
import Modal from './Modal.vue'


const DEFAULT_GROUP = 'pair'; //

export default {
  data() {
    const pairModelTemplate = {
      pair: {
        basic: 'EUR',
        quota: 'BYN',
      },
      source: 'Bloomberg',
      coefficient: 1,
      amount: 498.5,
      updatedAt: '03.09.24 10:57',
      mode: 'manual',
      date: '03.09.24 10:50',
      lastAmount: 498,
      change: {
        absolute: 0.95,
        percent: 0.0019,
      },
      changeSignal: 0,
    };

    const rowCount = Math.floor(Math.random() * 5) + 5;

    let pairModels = [];
    let changeSignal = [];

    for (let i = 0; i < rowCount; i++) {
      let temp = { ...pairModelTemplate };
      temp[ 'id' ] = i + 1;
      pairModels.push(temp);
      changeSignal[ temp[ 'id' ] ] = {
        'use': 0,
        'value': null,
      };
    }

    return {
      groupBy: DEFAULT_GROUP,
      pairModel: pairModelTemplate,
      pairModels: pairModels,
      editable: null,
      changeSignal: changeSignal,
      modalVisible: false
    };
  },
  methods: {
    openModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
  },
};
</script>
<style>
.pencil:hover {
  cursor: pointer;
}

body .modal {
  background-color: white;
  border: 1px solid;
  padding: 10px;
  display: block;
  position: absolute;
  top: 400px;
  left: 60px;
  width: 81%;
  height: auto;
}

.margin-bottom {
  margin-bottom: 20px;
}

</style>