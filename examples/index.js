import Vue from 'vue'
import vcSelect from '../dist/build.js'

new Vue({
	el: '#app',
	data () {
		return {
            bools: {
                'true': true,
                'false': false
            },
            name: 'name',
            label: 'label',
            placeholder: 'placeholder',
            options: {
                '0': '徐州',
                '1': '北京',
                '2': '上海',
                '3': '广州',
                '4': '深圳',
                '5': '兰州',
                '6': '沈阳',
                '7': '苏州',
                '8': '无锡',
                '9': '南京',
                '10': '镇江',
                '11': '南通',
                '12': '宿迁',
                '13': '连云港',
                '14': '常州',
                '15': '盐城'
            },
            value: '0',
            multiple: true,
            search: true,
            cos: true,
            showAll: true,
            svalue: '__all__',
            slabel: '全部',
            behavior: 'allChecked'
		}
	},
	components: {
        vcSelect
	}
})
