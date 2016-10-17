<template>
    <div class="vc-select-component form-group">
        <label class="label-item" v-if="label">{{ label }}</label>
        <div class="btn-group" :class="{ 'open': show }" :style="{ 'width': optionalWidth }">
            <button v-el:btn type="button" :class="{ 'text-to-left': !showPlaceholder && tags }" class="btn btn-default multiselect dropdown-toggle btn-multipe"
                @click="toggleDropdown"
                @mousedown.stop
                @blur="show = (searchable ? show : false)"
                :disabled="disabled"
                :readonly="readonly"
                :title="selectedItems || placeholder"
            >
                <a class="vc-selected-item" v-for="option in selectedOptions" v-show="tags" @mousedown.stop>
                    {{ option.label }}
                    <span @mousedown="select(option.value)" v-show="includes(option.value)">&times;</span>
                </a>
                <span class="btn-placeholder" v-show="showPlaceholder">{{ placeholder }}</span>
                <span class="caret" v-show="showPlaceholder"></span>
                <span class="btn-content" v-show="!tags">{{ selectedItems }}</span>
            </button>
            <ul class="dropdown-menu" :style="{ 'max-height': optionalHeight }" @mousedown.stop> <!-- make scrollbar draggable -->
                <li v-if="optionsLen && searchable" class="bs-searchbox">
                    <input type="text" @mousedown.stop v-model="searchText" placeholder="搜索" class="form-control" autocomplete="off" />
                    <span @mousedown.stop="searchText = ''" class="clear-search-text glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
                </li>
                <li v-if="optionsLen && showSelectAllOption">
                    <a @mousedown.stop.prevent="select(selectAllOptionValue)">
                        {{ selectAllOptionLabel }} 
                        <span class="glyphicon glyphicon-ok check-mark" v-show="includes(selectAllOptionValue)"></span>
                    </a>
                </li>
                <!-- default vc-option slot -->
                <slot>
                <template v-for="($index, option) in filteredOptions">
                <li @mousedown.stop.prevent="select(option.value, option.disabled)" :class="{ 'disabled': option.disabled }">
                    <a>
                        {{ option.label }}
                        <span class="glyphicon glyphicon-ok check-mark" v-show="includes(option.value)"></span>
                    </a>
                </li>
                </template>
                </slot>
                <slot v-if="!optionsLen" name="noContent"><div class="no-content-tips">暂无{{ label }}选项</div></slot>
                <div class="notify" v-show="showNotify" transition="fadein">(最多选取{{ limit }}个)</div>
            </ul>
        </div>
    </div>
</template>

<style lang="less">
.vc-select-component {

    label.label-item {
        position: relative;
        top: 7px;
        vertical-align: top;
        display: inline-block;
    }
    .bs-searchbox {
        padding: 4px 8px;
        position: relative;

        // 保证清除按钮的居中
        input {
            height: 34px;
            width: 100%; // 撑开宽度
        }

        .clear-search-text {
            visibility: hidden;
            position: absolute;
            right: 15px;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            opacity: .3;
        }

        &:hover .clear-search-text {
            visibility: visible;
        }
    }

    .btn-group {
        button.multiselect { /* override multiselect button height */
            padding: 2px 6px;
            min-height: 34px;
            width: 100%;
            overflow: hidden;
            margin: 0;
            color: #666;
            white-space: normal;
            -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
            transition: all .3s cubic-bezier(.645,.045,.355,1);

            &.text-to-left {
                text-align: left;
            }
            
            &:hover {
                background-color: #fff;
                border: 1px solid #A79F9F;
            }
            &:active {
                background-color: #fff;
                border: 1px solid #ccc;
                -webkit-box-shadow: none;
                box-shadow: none;
            }
            &:focus {
                background-color: #fff;
                border: 1px solid #ccc;
            }

            a.vc-selected-item {
                display: inline-block;
                text-align: left;
                line-height: 16px;
                color: inherit;
                font-size: 12px;
                position: relative;
                cursor: pointer;
                padding: 0 5px 1px;
                margin-right: 5px;
                margin-bottom: 2px;
                background-color: #f3f3f3;

                &:hover {
                    text-decoration: none;
                }

                @size: 5px;
                span {
                    width: @size;
                    height: @size;
                    color: #999;
                    font-weight: 700;
                    padding: 3px 2px 3px 1px;

                    &:hover {
                        color: #404040;
                    }
                }
            }
        }
        .dropdown-menu {
            min-width: 100%; // override bootstrap 160px
            // max-height: 400px;
            overflow: auto;
            width: auto;

            & > li {
                cursor: pointer;
            }

            & > li.disabled {
                opacity: .6;
                cursor: not-allowed;
            }

            // hack for hover
            & > li > a:hover {
                background-color: #1E90FF;
                color: #fff;
            }

            .no-content-tips {
                text-align: center;
                padding: 10px;
            }

            .notify {
                position: absolute;
                bottom: 5px;
                width: 96%;
                margin: 0 2%;
                min-height: 26px;
                padding: 3px 5px;
                background: #f5f5f5;
                border: 1px solid #e3e3e3;
                box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
                pointer-events: none;
                opacity: .9;
            }
        }
    } // .btn-group
} // component
</style>

<script>
// polyfill
Number.isInteger = Number.isInteger || function (val) {
    var value = +val
    return typeof value === "number" && 
        isFinite(value) && 
        Math.floor(value) === value
}

const COMPONENT_NS = 'SELECT'

import vcOption from './Option.vue'

const Select = {
    name: 'vc-select',
    props: {
        // 组件名称，也是DOM的name属性,默认随机生成
        name: {
            type: String,
            default: `vc-select-${Date.now()}`
        },
        // 项目说明文案
        label: String,
        // 对外暴露的值
        value: {
            twoWay: true,
            type: [Array, String, Number] // 内部会记录下初始化类型快照，用于反同步，只区分Array, 非Array
        },
        tags: {
            type: Boolean,
            default: false
        },
        // 占位提示
        placeholder: {
            type: String,
            default: '没有选择'
        },
        // 是否不可用
        disabled: {
            type: Boolean,
            default: false
        },
        // 是否只读
        readonly: {
            type: Boolean,
            default: false
        },
        // 选项: Array是目标类型，Object也支持转换，但是Array必须为Array<Object{ value: label }>
        options: {
            type: [Array, Object]
        },
        // 用于区分下拉选择的值的同步模式(时机)
        lazy: {
            type: Boolean,
            default: false
        },
        // 是否可多选
        multiple: {
            type: Boolean,
            default: false
        },
        // 是否可搜索，只有在 `options` 提供才可以
        searchable: { 
            type: Boolean,
            default: false
        },
        // 最多选择多少项
        limit: {
            type: Number,
            default: 1024
        },
        // 选择后自动关闭下拉,仅作用在单选
        closeOnSelect: {
            type: Boolean,
            default: false
        },
        // 选择按钮宽度，不包括label部分 
        width: {
            type: [Number, String],
            default: '200'
        },
        // 下拉列表高度
        height: {
            type: [Number, String],
            default: '400'
        },
        // 是否显示'全部'选项
        showSelectAllOption: {
            type: Boolean,
            default: false 
        },
        // 全选的文案
        selectAllOptionLabel: {
            type: String,
            default: '全部'
        },
        // 重要! 传给后端的key值，有默认值，初始化传入自动全选，可配置来避免冲突
        selectAllOptionValue: {
            type: String,
            default: '__all__'
        },
        // 是全部选项被选中还是语义上选中前后端约定的key，默认是全部选中
        selectAllBehavior: {
            type: String,
            default: 'allChecked' // ['allChecked', 'semantic'] 全选行为上可以是真正全部选项选中或语义上的选中'全部'这一项
        },
        // 选择了其他又选择了全部选项，则清空其他，只显示全部, 即全部与其他选项互斥,使得行为更清晰
        mutual: {
            type: Boolean,
            default: true
        },
        // 要对外派发的数据
        dispatchArgs: {
            type: Array
        },
        onShow: Function,
        onHide: Function,
        onSelect: Function
    },
    created () {
        // 注册到全局，便于操作
        let pool = this.$root['vc-select-pool']
        if (!pool) {
            this.$root['vc-select-pool'] = []
        }
        this.$root['vc-select-pool'].push(this)
    },
    ready () {
        // watch immediate已经确保了转换和类型确定
        if (!Array.isArray(this.vm)) {
            console.warn(`[vcSelect warn]: vm should be Array but now: ${typeof this.vm}`)
            return
        }
        // 再做一些转换，防止意外
        if (!this.multiple && this.vm.length > 1) {
            this.vm = this.vm.slice(0, 1)
        } else if (this.multiple && this.vm.length > this.limit) {
            this.vm = this.vm.slice(0, this.limit)
        }

        // 绑定点击空白处下拉选择框消失事件, 20160508改为监听mousedown(同时修改了模板), 让mousedown传递出去，
        // 因为mousedown先于click触发，这样就不能同时打开多个下拉菜单了,
        // 而click事件还能响应，来触发toggleDropdown方法，弹出下拉菜单! 反之不可...
        document.addEventListener('mousedown', () => {
            this.$emit('closeSelectList')
        }, false)
    },
    data () {
        return {
            uuid: `vc-select-${Date.now()}`,
            show: false, // 是否显示下拉
            type: '__NOTINIT__', // value的初始化时候的类型
            vm: [], // 内部使用的vm, 不然容易在twoWay模式下改变外部变量, 仅在内部vm变化时手动通过原始value变量来同步外界
            currentItem: '', // 当前点击的是哪一项
            searchText: null,
            selectedOptions: [], // 已经选择过的options
            showNotify: false
        }
    },
    computed: {
        cOptions () {
            let val = this.options
            if (!val) {
                return
            }

            // 目标结构:
            // [{
            //   label: '北京',
            //   value: '111'
            // }, {
            //   label: '上海',
            //   value: '222'
            // }]
            // Array: with vilid structure, return it to use
            if (val && val instanceof Array && val.length > 0 && "label" in val[0] && "value" in val[0]) {
                return val
            }
            // Object: transform it
            var arr = []
                if (val !== null && typeof val === 'object') {
                    var keys = Object.keys(val)
                        for (var i = 0, len = keys.length; i < len; i++) {
                            var obj = {}
                            obj['value'] = keys[i]
                                obj['label'] = val[keys[i]]
                                arr.push(obj)
                        }
                    return arr
                }

            // Other: return it for debug
            console.warn('[vcSelect warn]: maybe invalid options! => ', val)
            return val
        },
        filteredOptions () {
            let s = this.searchText
            let o = this.cOptions
            if (!s) {
                return o
            }
            return o.filter((item) => {
                return item['label'].indexOf(s) >= 0
            })
        },
        optionalWidth () {
            if (this.width == null || this.width === '') {
                return null
            }
            if (Number.isInteger(+this.width)) {
                return this.width + 'px'
            }
            return this.width
        },
        optionalHeight () {
            if (this.height == null || this.height === '') {
                return null
            }
            if (Number.isInteger(+this.height)) {
                return this.height + 'px'
            }
            return this.height
        },
        optionsAllArr () {
            var arr = []
            for (var i = 0; i < this.optionsLen; i++) {
                arr.push(this.cOptions[i]['value'])
            }
            return arr
        },
        optionsLen () {
            return this.cOptions && Object.keys(this.cOptions).length
        },
        enabledOptionsLength () {
            let count = 0
            this.cOptions.forEach((item) => {
                if (!item.disabled) {
                    count++
                }
            })
            return count
        },
        selectedItems () {
            // 关键点! 每次选择vm都可能被改写为字符串,所以每次都需要检查类型，保证是数组
            if (!Array.isArray(this.vm)) {
                this.vm = [this.vm]
            }
            if (this.vm.length === 0) 
                return

            // patch for selectAll 1
            if (this.showSelectAllOption && this.vm.indexOf(this.selectAllOptionValue) >= 0) {
                if (this.selectAllBehavior === 'semantic') {
                    return this.selectAllOptionLabel
                } else {
                    if (this.currentItem === this.selectAllOptionValue) {
                        this.vm = []
                        this.vm.push(this.selectAllOptionValue)
                        this.vm = this.cOptionsAllArr
                    }
                }
            }
            // 性能瓶颈!!!
            if (this.vm.length < 4) {
                var foundItems = []
                for (var i = 0; i < this.optionsLen; i++) {
                    this.vm.forEach((item, index) => {
                        if (item == this.cOptions[i].value) {
                            foundItems.push(this.cOptions[i].label)
                        }
                    })
                }
                // 最终结果的显示
                if (foundItems.length < 4) {
                    return foundItems.join(', ')
                }
            } else {
                return `已选${this.vm.length}项`
            }

        },
        showPlaceholder () {
          return Array.isArray(this.vm) && (this.vm.length === 0)
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (value) {

                // 0720: fix noData init crash...
                if (value == null) {
                    return
                }

                if (value === '') {
                    this.vm = []
                    return
                }

                if (this.type === '__NOTINIT__' && Array.isArray(value)) {
                    this.type = 'Array'
                }
                if (this.type === '__NOTINIT__' && !Array.isArray(value)) {
                    // 不区分是字符串还是数字(很多时候其实是数字，但是初始化给了字符串比如ls里取的)
                    this.type = 'noArray' 
                }

                // 强制vm为数组
                this.vm = this.type === 'Array' ? value.slice(0) : [value]
                if (this.type === 'noArray' && typeof value === 'string' &&typeof value === 'string' &&  this.value.indexOf(',')　>= 0) {
                    this.vm = value.replace(/\s/, '').split(',')
                }
                // 对付初始化值就是全部的等待异步获取的options完毕的情况
                var vv = this.type === 'Array' ? value[0] : value
                // if (this.showSelectAllOption && (vv === this.selectAllOptionValue) ) {
                // bug fix 0907, remove showSelectAllOption
                if (vv === this.selectAllOptionValue) {

                    this.currentItem = this.selectAllOptionValue

                    this.select(vv)
                    this.$watch('options', (val) => {
                        this.select(vv)
                        this.reWriteValue()
                    })
                }

                if (Array.isArray(this.vm) && this.vm.length > 1 && !this.multiple) {
                    console.warn(`pass ${this.vm.length} values while multiple is false!`)
                }
            }
        },
        vm: {
            deep: true,
            immediate: true,
            handler (vm) {
                if (vm.length > this.limit) {
                    this.showNotify = true
                    this.vm.pop()
                    setTimeout(() => {
                        this.showNotify = false
                    }, 1000)
                }
                if (!this.cOptions) return
                this.selectedOptions = this.cOptions.filter((item, index) => {
                    if (vm && !Array.isArray(vm)) {
                        vm = vm.split(',')
                    }
                    return vm.some(option => option == item.value)
                })
            }
        },
        show (val) {
            this.searchText = ''
            var msg = {
                action: val ? 'show' : 'hide',
                data: this
            }
            if (val) {
                this.$dispatch(COMPONENT_NS, msg, name)
                this.onShow && this.onShow()
            } else {
                // core: 回写value
                if (this.lazy) {
                    this.reWriteValue()
                }
                this.$dispatch(COMPONENT_NS, msg, name)
                this.onHide && this.onHide()
            }
        }
    },
    methods: {
        includes (val) {
            if (Array.isArray(this.vm)) {
                return this.vm.some((item, index) => {
                    return item == val // 非严格类型匹配,替换模板中使用原生indexOf
                })
            }
        },
        reWriteValue () {
            if (this.type === 'Array') {
                this.value = this.vm
            } else {
                if (this.vm.length === 1) {
                    this.value = this.vm[0]
                } else if (this.vm.length > 1) {
                    this.value = this.vm.join(',')
                } else {
                    // 0809: fix vm = [] bug, not trigger to reWrite value
                    this.value = ''
                }
            }
            this.$parent.value = this.value.slice(0)
        },
        // 在立即同步模式下，最后会调用reWriteValue方法将vm同步至value
        select (v, disabled) {
            if (disabled) return
            this.currentItem = v
            // patch for selectAll 2, 正好选了'全部'这一项
            // if (this.showSelectAllOption && (v === this.selectAllOptionValue) && this.mutual) {
            // bug fix 0907, remove showSelectAllOption
            if ((v === this.selectAllOptionValue) && this.mutual) {
                if (!this.multiple) {
                    this.$emit('closeSelectList')
                }

                if (this.selectAllBehavior === 'semantic') {
                    this.vm = [this.selectAllOptionValue]
                } else { // allChecked
                    // if (this.vm.length < this.optionsLen) { // 如果不在全部选择状态下则全选
                    if (this.vm.length < this.enabledOptionsLength) { // 如果不在全部选择状态下则全选
                        this.vm = []
                        for (var i = 0; i < this.optionsLen; i++) {
                            if (!this.cOptions[i].disabled) {
                                this.vm.push(this.cOptions[i].value)
                            }
                        }
                    } else { // toggle到全不选
                        this.vm = []
                    }
                }

            } else {
                // patch for selectAll 3, 选了全部，这时又选了其他，则清除'全选'这一项
                if ( this.mutual && (this.vm.indexOf(this.selectAllOptionValue) >= 0) && this.selectAllBehavior === 'semantic' ) {
                    this.vm = []
                }

                // if (this.vm.indexOf(v) === -1) {
                if (!this.includes(v)) {
                    if (this.multiple) {
                        this.vm.push(v)
                    } else {
                        this.vm = [v]
                    }
                } else {
                    if (this.multiple) {
                        this.vm.$remove(v)
                    }
                }

                // 使得closeOnSelect配置只作用于单选,为了更好体验
                if (this.closeOnSelect && !this.multiple) {
                    this.toggleDropdown()
                }
            }

            var msg = {
                action: 'onSelect',
                data: this.dispatchArgs
            }
            this.$dispatch(COMPONENT_NS, msg, this.name)
            this.onSelect && this.onSelect()

            // core: 回写value
            if (!this.lazy) {
                this.reWriteValue()
            }
        },
        toggleDropdown () {
            // toggle本组件
            this.show = !this.show
            let root = this.$root || []
            // 并且关闭其他组件
            root['vc-select-pool'].forEach(item => {
                if (item.uuid !== this.uuid) {
                    item.show = false
                }
            })
        }
    },
    events: {
        closeSelectList () {
            this.show = false
        }
    }
}

Select.vcOption = vcOption

export default Select
</script>
