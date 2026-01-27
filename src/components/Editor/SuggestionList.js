import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

const SuggestionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = index => {
    const item = props.items[index]

    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[280px] p-1 animate-in fade-in zoom-in duration-200">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`flex flex-col w-full text-left px-3 py-2 rounded-lg transition-colors ${
              index === selectedIndex
                ? 'bg-primary text-secondary'
                : 'hover:bg-muted text-gray-700'
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className={`font-bold text-sm ${index === selectedIndex ? 'text-secondary' : 'text-gray-900'}`}>{item.title}</div>
            <div className={`text-xs truncate ${index === selectedIndex ? 'text-secondary/80' : 'text-gray-500'}`}>{item.category}</div>
          </button>
        ))
      ) : (
        <div className="p-3 text-sm text-gray-500 text-center italic">
          No templates found
        </div>
      )}
    </div>
  )
})

SuggestionList.displayName = 'SuggestionList'

export default SuggestionList
