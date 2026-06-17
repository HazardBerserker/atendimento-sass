<template>
  <button
    type="button"
    class="base-switch"
    :class="{ on: modelValue }"
    role="switch"
    :aria-checked="modelValue"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="bsw-track"><span class="bsw-thumb"></span></span>
    <span v-if="label" class="bsw-label">{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'BaseSwitch',
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
}
</script>

<style scoped>
.base-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.bsw-track {
  position: relative;
  width: 42px;
  height: 24px;
  border-radius: 14px;
  background: var(--c-border-strong);
  transition: background 0.2s ease;
  flex-shrink: 0;
}
.bsw-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.on .bsw-track { background: var(--c-primary); }
.on .bsw-thumb { transform: translateX(18px); }
.bsw-label {
  font-family: 'Nunito', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-text);
}
</style>
