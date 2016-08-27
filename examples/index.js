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
            height: '400',
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
            searchable: true,
            cos: true,
            showSelectAllOption: true,
            selectAllOptionValue: '__all__',
            selectAllOptionLabel: '全部',
            selectAllBehavior: 'allChecked'
		}
	},
    methods: {
        selectAllToggle () {
            this.showSelectAllOption = true
            this.selectAllBehavior = 'allChecked'
            this.showSelectAllOption = true
            this.searchable = true
            this.multiple = true
            this.value = this.value === '' ? this.selectAllOptionValue : ''
        },
        selectAllSemantic () {
            this.showSelectAllOption = true
            this.selectAllBehavior = 'semantic'
            this.searchable = true
            this.multiple = true
            this.value = this.selectAllOptionValue
        },
        selectNone () {
            this.showSelectAllOption = true
            this.selectAllBehavior = 'allChecked'
            this.value = ''
        },
        simple () {
            this.value = ''
            this.showSelectAllOption = false
            this.multiple = false
            this.searchable = false
        }
    },
	components: {
        vcSelect
	}
})
