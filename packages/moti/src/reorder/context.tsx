// @ts-nocheck
import type { ReorderContextProps } from 'framer-motion/types/components/Reorder/types'
import { createContext } from 'react'

const ReorderContext = createContext<ReorderContextProps<any> | null>(null)

export { ReorderContext }
