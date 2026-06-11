import { useLayoutEffect, useRef } from 'react'

// Textarea that grows vertically to fit its content (no inner scrollbar).
export default function AutoTextarea({ value, onChange, minRows = 2, className = '', ...rest }) {
  const ref = useRef(null)

  const resize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  // Resize on value change (covers programmatic updates like import/reset).
  useLayoutEffect(resize, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      rows={minRows}
      onChange={(e) => {
        onChange(e)
        resize()
      }}
      className={`autogrow ${className}`}
      {...rest}
    />
  )
}
