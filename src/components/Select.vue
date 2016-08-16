<template>
    <div class="form-group vc-select-component">
        <label class="label-item" v-if="label">{{ label }}</label>
        <div class="btn-group" :class="{ 'open': show }">
            <!-- 此处mousedown.stop则可以实现toggle,但是可以同时打开多个select了,反之则不可toggle -->
            <button v-el:btn type="button" class="btn btn-default multiselect dropdown-toggle btn-multipe"
                @click="toggleDropdown"
                @blur="show = (search ? show : false)"
                :disabled="disabled"
            >
                <span class="btn-placeholder" v-show="showPlaceholder">{{ placeholder }}</span>
                <span class="btn-content">{{ selectedItems }}</span>
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" @mousedown.stop> <!-- make scrollbar drapable -->
                <template v-if="options.length">
                    <li v-if="search" class="bs-searchbox">
                        <input type="text" @mousedown.stop placeholder="搜索" v-model="searchText" class="form-control" autocomplete="off" />
                        <span class="clear-searchText glyphicon glyphicon-remove-circle" @mousedown.stop="searchText = ''" aria-hidden="true"></span>
                    </li>
                    <div class="vselected-panel" v-show="false && showSelectedPanel">
                        <a v-for="option in selectedOptions" @dblclick="select(option.value)" v-show="$index < maxSelectedPanelCount" @mousedown.stop style="cursor:pointer">
                            {{ option.label }}
                            <span @mousedown.prevent="select(option.value)" class="" v-show="includes(option.value)">&times;</span>
                        </a>
                    </div>
                    <li v-if="showSelectAllOption">
                        <a @mousedown.prevent="select(selectAllOptionValue)" @mousedown.stop style="cursor:pointer">
                            {{ selectAllOptionLabel }} 
                            <span class="glyphicon glyphicon-ok check-mark" v-show="includes(selectAllOptionValue)"></span>
                        </a>
                    </li>
                    <li v-for="($index, option) in options | filterBy searchText">
                        <a @mousedown.prevent="select(option.value)" @mousedown.stop style="cursor:pointer">
                            {{ option.label }}
                            <span class="glyphicon glyphicon-ok check-mark" v-show="includes(option.value)"></span>
                        </a>
                    </li>
                </template>
                <slot v-else><div class="no-content-tips">暂无{{ label }}选项</div></slot>
                <div class="notify" v-show="showNotify" transition="fadein">(最多选取{{ limit }}个)</div>
            </ul>
        </div>
    </div>
</template>

<style lang="less">
.vc-select-component {

    label.label-item {
        position: relative;
        top: 1px;
    }

    .bs-searchbox {
        padding: 4px 8px;
        position: relative;

        // 保证清除按钮的居中
        input {
            height: 34px;
            width: 100%; // 撑开宽度
        }

        .clear-searchText {
            visibility: hidden;
            position: absolute;
            right: 15px;
            top: 50%;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            opacity: .3;
        }

        &:hover .clear-searchText {
            visibility: visible;
        }
    }

    .btn-group {

        button.multiselect { /* override multiselect button height */
            height: 34px;
            width: 100%;
            overflow: hidden;
        }
        .dropdown-menu .notify {
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
    .dropdown-menu {
        min-width: 100%; // override bootstrap 160px
        max-height: 400px;
        overflow: auto;
        width: auto;

        // hack for hover
        & > li > a:hover {
            background-color: #1E90FF;
            color: #fff;
        }
    }

    .no-content-tips {
        text-align: center;
        padding: 10px;
    }

    div.vselected-panel {
        padding: 3px 8px 4px;
        border-bottom: 1px solid #eee;

        a {
            display: inline-block;
            position: relative;
            cursor: pointer;
            text-align: center;
            padding: 1px 5px;
            margin: 0px 5px 3px;
            margin-left: 0;
            border: 1px solid #ccc;
            border-radius: 3px;
            color: #333;

            @size: 5px;
            span {
                position: absolute;
                top: -9px;
                right: 0px;
                width: @size;
                height: @size;
                font-size: @size;
                color: #bbb6b6;
                font-weight: 700;
            }
        }
    }
}
</style>

<script>
const COMPONENT_NS = 'SELECT'

export default {
    props: {
        name: {
            type: String,
            default: 'vc-select' + Date.now()
        },
        label: String,
        value: {
            twoWay: true,
            type: [Array, String, Number] // 内部会记录下初始化类型快照，用于反同步，只区分Array, 非Array
        },
        placeholder: {
            type: String,
            default: '没有选择'
        },
        options: {
            type: [Array, Object], // Array是目标类型，Object也支持转换，但是Array中item必须为Object，结构为{value: label}
            coerce: function (val) {
                // 目标结构:
                // [{
                //   label: '北京',
                //   value: '131'
                // }, {
                //   label: '上海',
                //   value: '289'
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
                console.warn('maybe invilid options!')
                return val
            }
        },
        multiple: {
            type: Boolean,
            default: false
        },
        search: { // Allow searching (only works when options are provided)
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 1024
        },
        closeOnSelect: { // only works when multiple === false
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        /* 全选 */
        showSelectAllOption: { // 是否显示'全部'选项
            type: Boolean,
            default: false 
        },
        selectAllOptionLabel: { // 全选的文案
            type: String,
            default: '全部'
        },
        selectAllOptionValue: { // 重要! 传给后端的key值，有默认值，初始化传入自动全选，可配置来避免冲突
            type: String,
            default: '__all__'
        },
        selectAllBehavior: { // 是全部选项被选中还是语义上选中前后端约定的key，默认是全部选中
            type: String,
            default: 'allChecked' // ['allChecked', 'semantic'] 全选行为上可以是真正全部选项选中或语义上的选中'全部'这一项
        },
        mutual: { // 选择了其他又选择了全部选项，则清空其他，只显示全部, 即全部与其他选项互斥,使得行为更清晰
            type: Boolean,
            default: true
        },
        dispatchArgs: {
            type: Array
        },
        // 已选中面板
        showPanelCount: {
            type: Number,
            default: 30
        },
        maxSelectedPanelCount: {
            type: Number,
            default: 7
        }
    },
    created: function () {
    },
    ready: function () {
        // watch immediate已经确保了转换和类型确定
        if (!Array.isArray(this.vm)) {
            console.warn('vm should be Array but now: ' + typeof this.vm)
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
        document.addEventListener('mousedown', function () {
            this.$emit('closeSelectList')
        }.bind(this), false)
    },
    data: function () {
        return {
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
        optionsAllArr: function () {
            var arr = []
            for (var i = 0; i < this.optionsLength; i++) {
                arr.push(this.options[i]['value'])
            }
            return arr
        },
        optionsLength: function () {
            return Object.keys(this.options).length
        },
        showSelectedPanel: function () {
            return Object.keys(this.options).length > this.showPanelCount
        },
        selectedItems: function () {
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
                        this.vm = this.optionsAllArr
                        // for (var i = 0; i < this.optionsLength; i++) {
                        //     this.vm.push(this.options[i].value)
                        // }
                    }
                }
            }
            // 性能瓶颈!!!
            if (this.vm.length < 4) {
                var foundItems = []
                for (var i = 0; i < this.optionsLength; i++) {
                    this.vm.forEach(function (item, index) {
                        if (item == this.options[i].value) {
                            foundItems.push(this.options[i].label)
                        }
                    }.bind(this))
                }
                // 最终结果的显示
                if (foundItems.length < 4) {
                    return foundItems.join(', ')
                }
            } else {
                return this.vm.length + '个选择'
            }

        },
        showPlaceholder: function () {
          return Array.isArray(this.vm) && (this.vm.length === 0)
        }
    },
    watch: {
        'value': {
            immediate: true,
            deep: true,
            handler: function (value) {

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
                    this.type = 'noArray' // 不在区分是字符串还是数字(很多时候其实是数字，但是初始化给了字符串比如ls里取的)
                }

                // 强制vm为数组
                this.vm = this.type === 'Array' ? value : [value]
                if (this.type === 'noArray' && typeof value === 'string' &&typeof value === 'string' &&  this.value.indexOf(',')　>= 0) {
                    this.vm = value.replace(/\s/, '').split(',')
                }
                // 对付初始化值就是全部的等待异步获取的options完毕的情况
                var vv = this.type === 'Array' ? value[0] : value
                if (this.showSelectAllOption && (vv === this.selectAllOptionValue) ) {

                    this.currentItem = this.selectAllOptionValue

                    this.select(value)
                    this.$watch('options', function(val) {
                        this.select(value)
                    }.bind(this))
                }

                if (Array.isArray(this.vm) && this.vm.length > 1 && !this.multiple) {
                    console.warn('pass ' + this.vm.length + ' values while multiple is false!')
                }
            }
        },
        'vm': {
            deep: true,
            handler: function (vm) {
                if (vm.length > this.limit) {
                    this.showNotify = true
                    this.vm.pop()
                    setTimeout(function () {
                        this.showNotify = false
                    }.bind(this), 1000)
                }
                this.selectedOptions = this.options.filter(function (item, index) {
                    return this.vm.some(function (option) { return option === item.value })
                }.bind(this))
            }
        },
        'show': function (val) {
            this.searchText = ''
            var msg = {
                action: val ? 'show' : 'hide',
                data: this
            }
            if (val) {
                this.$dispatch(COMPONENT_NS, msg, name)
            } else {
                this.$dispatch(COMPONENT_NS, msg, name)
            }
        }
    },
    methods: {
        includes: function (val) {
            if (Array.isArray(this.vm)) {
                return this.vm.some(function (item, index) {
                    return item == val // 非严格类型匹配
                })
            }
        },
        reWriteValue: function () {
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
        },
        // 最后调用reWriteValue方法将vm同步至value
        select: function (v) {
            this.currentItem = v
            var vv = Array.isArray(v) ? v[0] : v
            // patch for selectAll 2, 正好选了'全部'这一项
            if (this.showSelectAllOption && (vv === this.selectAllOptionValue) && this.mutual) {
                if (!this.multiple) {
                    this.$emit('closeSelectList')
                }

                if (this.selectAllBehavior === 'semantic') {
                    this.vm = [this.selectAllOptionValue]
                } else { // allChecked
                    if (this.vm.length < this.optionsLength) { // 如果不在全部选择状态下则全选
                        this.vm = []

                        // this.vm.push(this.selectAllOptionValue) // should not include value we mock 20160701
                        
                        for (var i = 0; i < this.optionsLength; i++) {
                            this.vm.push(this.options[i].value)
                        }
                        // this.vm = this.optionsAllArr
                    } else { // toggle到全不选
                        this.vm = []
                    }
                }

            } else {
                // patch for selectAll 3, 选了全部，这时又选了其他，则清除'全选'这一项
                if ( this.mutual && (this.vm.indexOf(this.selectAllOptionValue) >= 0) && this.selectAllBehavior === 'semantic' ) {
                    this.vm = []
                }

                if (this.vm.indexOf(v) === -1) {
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

                var msg = {
                    action: 'selectChanged',
                    data: this.dispatchArgs
                }
                this.$dispatch(COMPONENT_NS, msg, this.name)
            }

            // core: 回写value
            this.reWriteValue()
        },
        toggleDropdown: function () {
            this.show = !this.show
        }
    },
    events: {
        'closeSelectList': function () {
            this.show = false
        }
    }
}
</script>
