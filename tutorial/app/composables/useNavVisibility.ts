// composables/useNavVisibility.ts
export const useNavVisibility = () => {
  const isHidden = useState('nav-hidden', () => false)
  const isMobile = useState('nav-is-mobile', () => false)

  if (import.meta.client) {
    const { width } = useWindowSize()
    watch(width, (w) => {
      isMobile.value = w < 768
      isHidden.value = w < 768
    }, { immediate: true })
  }

  const toggleHidden = () => (isHidden.value = !isHidden.value)

  return { isHidden, isMobile, toggleHidden }
}