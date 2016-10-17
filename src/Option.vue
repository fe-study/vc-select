<template>
    <li @mousedown.stop.prevent="handleClick" v-show="show" class="vc-option-component" :class="{ 'disabled': d }">
        <a>
            <span v-el:label><slot>{{ label }}</slot></span>
            <span class="glyphicon glyphicon-ok check-mark" v-show="checked"></span>
        </a>
    </li>
</template>

<style>
.vc-option-component {
    position: relative;
}
.vc-option-component a span.check-mark {
  position: absolute;
  display: inline-block;
  right: 15px;
  margin-top: 5px;
}
</style>

<script>
export default {
    name: 'vc-option',
    props: {
        value: String,
        label: String,
        disabled: Boolean // 貌似传入'' 也会被js给转为false,就不设置default: false了
    },
    data () {
        return {
        }
    },
    ready () {
        if (!this.$parent.options) {
            this.$parent.options = []
        }
        // 取slot,组合成option注入父组件
        let slotLabel = this._slotContents.default.textContent
        this.$parent.options.push({
            'value': this.value,
            'label': slotLabel || this.label,
            'disabled': this.d
        })
    },
    computed: {
        // 除非传入 `:disabled="false"`，否则只要有 `disabled` 字样就是true
        // enum: [disabled, :disabled="true", :disabled="false"]
        d () { 
            if (this.disabled === false) {
                return false 
            }
            return true
        },
        show () {
            if (!this.$parent.filteredOptions) {
                return
            }
            return this.$parent.filteredOptions.some((item) => {
                return item['value'] === this.value
            })
        },
        checked () {
            return this.$parent.includes(this.value)
        }
    },
    methods: {
        handleClick () {
            if (this.d) return
            const parent = this.$parent
            if (parent.multiple && parent.value != null) {
                let v
                if (!Array.isArray(parent.value)) {
                    v = parent.value.split(',') 
                    v = v.filter(item => item !=='')
                    const index = v.indexOf(this.value)
                    v[~index ? '$remove' : 'push'](this.value)
                    parent.value = v.join(',')
                } else {
                    const index = parent.value.indexOf(this.value)
                    parent.value[~index ? '$remove' : 'push'](this.value)
                }
            } else {
                parent.value = [this.value]
                parent.show = false
            }
            this.$parent.onSelect && this.$parent.onSelect()
        }
    }
}
</script>
