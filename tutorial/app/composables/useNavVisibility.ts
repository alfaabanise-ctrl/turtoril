// composables/useNavVisibility.ts
export const useNavVisibility = () => {
  const isHidden = useState('nav-hidden', () => false)
  const toggleHidden = () => (isHidden.value = !isHidden.value)

  return { isHidden, toggleHidden }
}