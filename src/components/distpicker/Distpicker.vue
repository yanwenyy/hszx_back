<template>
  <div class="distpicker-address-wrapper">
    <template v-if="type != 'mobile'">
      <el-select @change="getCities" placeholder="政策省" clearable v-model="currentProvince" :disabled="disabled || provinceDisabled">
        <el-option :value="placeholders.province">{{ placeholders.province }}</el-option>
        <el-option v-for="(item, index) in provinces"
                :value="item"
                :key="index">
          {{ item }}
        </el-option>
      </el-select>
      <template v-if="!onlyProvince">
        <el-select @change="getAreas" placeholder="政策市" clearable v-model="currentCity" :disabled="disabled || cityDisabled">
          <el-option :value="placeholders.city">{{ placeholders.city }}</el-option>
          <el-option v-for="(item, index) in cities"
                  :value="item"
                  :key="index">
            {{ item }}
          </el-option>
        </el-select>
        <select v-if="!hideArea" v-model="currentArea" :disabled="disabled || areaDisabled">
          <!--<option :value="placeholders.area">{{ placeholders.area }}</option>-->
          <option v-for="(item, index) in areas "
                  :value="item"
                  :key="index">
            {{ item }}
          </option>
        </select>
      </template>
    </template>
    <template v-else>
      <div :class="addressHeader">
        <ul>
          <li :class="{'active': tab === 1}" @click="resetProvince">{{ currentProvince && !staticPlaceholder ? currentProvince : placeholders.province }}</li>
          <template v-if="!onlyProvince">
            <li v-if="showCityTab" :class="{'active': tab === 2}" @click="resetCity">{{  currentCity && !staticPlaceholder ? currentCity : placeholders.city }}</li>
            <li v-if="showAreaTab && !hideArea" :class="{'active': tab === 3}">{{ currentArea && !staticPlaceholder ? currentArea : placeholders.area }}</li>
          </template>
        </ul>
      </div>
      <div :class="addressContainer">
        <ul v-if="tab === 1">
          <li v-for="(item, index) in provinces"
              :class="{'active': item === currentProvince}"
              @click="chooseProvince(item)"
              :key="index">
            {{ item }}
          </li>
        </ul>
        <template v-if="!onlyProvince">
          <ul v-if="tab === 2">
            <li v-for="(item, index) in cities"
                :class="{'active': item === currentCity}"
                @click="chooseCity(item)"
                :key="index">
              {{ item }}
            </li>
          </ul>
          <ul v-if="tab === 3 && !hideArea">
            <li v-for="(item, index) in areas"
                :class="{'active': item === currentArea}"
                @click="chooseArea(item)"
                :key="index">
              {{ item }}
            </li>
          </ul>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import DISTRICTS from './districts';

const DEFAULT_CODE = 100000;

export default {
  name: 'v-distpicker',
  props: {
    province: { type: [String, Number], default: '' },
    city: { type: [String, Number], default: '' },
    area: { type: [String, Number], default: '' },
    type: { type: String, default: '' },
    hideArea: { type: Boolean, default: false },
    onlyProvince: { type: Boolean, default: false },
    staticPlaceholder: { type: Boolean, default: false },
    placeholders: {
      type: Object,
      default() {
        return {
          province: '省',
          city: '市',
          area: '区',
        }
      }
    },
    disabled: { type: Boolean, default: false },
    provinceDisabled: { type: Boolean, default: false },
    cityDisabled: { type: Boolean, default: false },
    areaDisabled: { type: Boolean, default: false },
    addressHeader: { type: String, default: 'address-header' },
    addressContainer: { type: String, default: 'address-container' },
  },
  data() {
    return {
      tab: 1,
      showCityTab: false,
      showAreaTab: false,
      provinces: [],
      cities: [],
      areas: [],
      currentProvince: this.determineType(this.province),
      currentCity: this.determineType(this.city),
      currentArea: this.determineType(this.area),
    }
  },
  created() {

      this.provinces = this.getDistricts()


  },

  methods: {
    reset(){
      this.currentProvince=""
      this.currentCity=""
    },
    setData(value, check = '') {
      return {
        code: this.getAreaCode(value, check),
        value: value,
      }
    },
    emit(name) {
      let data = {
        province: this.setData(this.currentProvince)
      }

      if (!this.onlyProvince) {
        this.$set(data, 'city', this.setData(this.currentCity))
      }

      this.$emit(name, data)
    },
    getCities() {
      this.emit('province')
      if(this.currentProvince=='全国'){
        this.cities=[]
        this.currentCity=""
        return false
      }
      this.cities = this.determineValue(this.currentProvince)
      this.cleanList('areas')
      if (this.cities.length === 0) {
        this.emit('selected')
        this.tab = 1
        this.showCityTab = false
      }
    },
    getAreas() {
      this.emit('city')
      this.areas = this.determineValue(this.currentCity,  this.currentProvince)
      if (this.areas.length === 0) {
        this.emit('selected')
        this.tab = 2
        this.showAreaTab = false
      }
    },
    resetProvince() {
      this.tab = 1
      this.provinces = this.getDistricts()
      this.showCityTab = false
      this.showAreaTab = false
    },
    resetCity() {
      this.tab = 2
      this.showCityTab = true
      this.showAreaTab = false
      this.getCities()
    },
    chooseProvince(name) {
      this.currentProvince = name
      if (this.onlyProvince) return
      this.tab = 2
      this.showCityTab = true
      this.showAreaTab = false
      this.getCities()
    },
    chooseCity(name) {
      this.currentCity = name
      if (this.hideArea) return
      this.tab = 3
      this.showCityTab = true
      this.showAreaTab = true
      this.getAreas()
    },
    chooseArea(name) {
      this.currentArea = name
    },
    getAreaCodeByPreCode(name, preCode) {
      let codes = []

      for(let x in DISTRICTS) {
        for(let y in DISTRICTS[x]) {
          if(name === DISTRICTS[x][y]) {
            codes.push(y)
          }
        }
      }

      if (codes.length > 1) {
        let index
        codes.forEach((item, i) => {
          if (item.slice(0, 2) == preCode) {
            index = i
          }
        })

        return codes[index]
      } else {
        return codes[0]
      }
    },
    getAreaCode(name, check = '') {
      for(let x in DISTRICTS) {
        for(let y in DISTRICTS[x]) {
          if(name === DISTRICTS[x][y]) {
            if (check.length > 0) {
              if (y.slice(0, 2) !== this.getAreaCodeByPreCode(check, y.slice(0, 2)).slice(0, 2)) {
                continue
              } else {
                return y
              }
            } else {
              return y
            }
          }
        }
      }
    },
    getCodeValue(code) {
      for(let x in DISTRICTS) {
        for(let y in DISTRICTS[x]) {
          if(code === parseInt(y)) {
            return DISTRICTS[x][y]
          }
        }
      }
    },
    getDistricts(code = DEFAULT_CODE) {
      return DISTRICTS[code] || []
    },
    determineValue(currentValue, placeholderValue, check = '') {
      if(currentValue === placeholderValue) {
        return []
      } else {
        return this.getDistricts(this.getAreaCode(currentValue, check))
      }
    },
    determineType(value) {
      if(typeof value === 'number') {
        return this.getCodeValue(value)
      }

      return value
    },
    cleanList(name) {
      this[name] = []
    },
  }
}
</script>

<style lang="scss">
.distpicker-address-wrapper {
  color: #9caebf;
  select {
    padding: .5rem .75rem;
    height: 40px;
    font-size: 1rem;
    line-height: 1.25;
    color: #464a4c;
    background-color: #fff;
    background-image: none;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: .25rem;
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;

    option {
      font-weight: normal;
      display: block;
      white-space: pre;
      min-height: 1.2em;
      padding: 0px 2px 1px;
    }
  }
  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
    }
  }
  .address-header {
    background-color: #fff;

    ul {
      display: flex;
      justify-content: space-around;
      align-items: stretch;

      li {
        display: inline-block;
        padding: 10px 10px 7px;

        &.active {
          border-bottom: #52697f solid 3px;
          color: #52697f;
        }
      }
    }
  }
  .address-container {
    background-color: #fff;

    ul {
      height: 100%;
      overflow: auto;

      li {
        padding: 8px 10px;
        border-top: 1px solid #f6f6f6;

        &.active {
          color: #52697f;
        }
      }
    }
  }
}
    .disabled-color{
        background: #f8f8f8;
    }
</style>
