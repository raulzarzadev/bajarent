import type { ComponentProps } from 'react'

// Minimal stub to satisfy react-native-paper's dynamic icon requires without bundling vector icons.
const MaterialCommunityIcon = (_props: ComponentProps<'svg'> & { name?: string }) => null

export default MaterialCommunityIcon
