import Vue from 'vue'
import vcSelect from '../src/Select'
const vcOption = vcSelect.vcOption
// console.log(vcSelect, vcOption)

function parseURL (url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port || '80',
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
 }

new Vue({
	el: '#app',
	data () {
		return {
            bools: {
                'true': true,
                'false': false
            },
            name: 'name',
            width: '300',
            height: '300',
            label: 'label',
            placeholder: 'placeholder',
            options: {
                '0': '徐州',
                '1': '北京',
                '2': '上海',
                '3': '广州',
                '4': '深圳',
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
            lazy: false,
            value: '',
            multiple: true,
            searchable: true,
            cos: true,
            showSelectAllOption: true,
            selectAllOptionValue: '__all__',
            selectAllOptionLabel: '全部',
            selectAllBehavior: 'allChecked',
            tags: false 
		}
	},
    created () {
        let href = location.href
        let p = parseURL(href)
        let type = p.params.type || 'array'
        let value = p.params.value || this.selectAllOptionValue 
        if (type.toLowerCase() === 'array') {
            this.value = [value]
        } else {
            this.value = value
        }
    },
    methods: {
        onShow (){
            console.log('select show')
        },
        onHide () {
            console.log('select hide')
        },
        onSelect (...args) { // with arguments
            // console.log(args)
        },
        lazyTrueFn () {
            this.lazy = true
        },
        lazyFalseFn () {
            this.lazy = false
        },
        selectAllToggle () {
            this.showSelectAllOption = true
            this.selectAllBehavior = 'allChecked'
            this.showSelectAllOption = true
            this.searchable = true
            this.multiple = true
            this.value = this.value === '' ? this.selectAllOptionValue : ''
        },
        selectNone () {
            this.showSelectAllOption = true
            this.selectAllBehavior = 'allChecked'
        },
        simple () {
            this.showSelectAllOption = false
            this.multiple = false
            this.searchable = false
        },
        removeLongItem () {
            this.options = {
                '0': '徐州',
                '1': '北京',
                '2': '上海',
                '3': '广州',
                '4': '深圳',
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
            }
        },
        addLongItem () {
            this.options = {
                '0': '徐州',
                '1': '北京',
                '5': '测试一个非常非常非常非常非常非常非常非常长的项目',
                '2': '上海',
                '3': '广州',
                '4': '深圳',
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
            }
        },
        addDisabledItem () {
            this.value = []
            this.options = [{
                'value': '111',
                'label': '徐州',
                'disabled': false
            }, {
                'value': '222',
                'label': '南京',
                'disabled': false
            }, {
                'value': '333',
                'label': '北京',
                'disabled': true
            }, {
                'value': '444',
                'label': '宇宙',
                'disabled': false
            }]
        },
        toggleTags () {
            return this.tags = !this.tags
        }
    },
	components: {
        vcSelect,
        vcOption
	}
})
