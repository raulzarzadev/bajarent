#!/usr/bin/env bun

/**
 * Performance Audit Script
 *
 * Verifica el estado de la migración de Context API → Redux
 * y reporta estadísticas de performance
 */

import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

const srcDir = './src'

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
}

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = readdirSync(dir)

  files.forEach((file) => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)

    if (
      stat.isDirectory() &&
      !file.startsWith('.') &&
      file !== 'node_modules'
    ) {
      walkDir(filePath, callback)
    } else if (
      stat.isFile() &&
      (file.endsWith('.tsx') || file.endsWith('.ts'))
    ) {
      callback(filePath)
    }
  })
}

console.log(`${colors.bold}${colors.cyan}
╔═══════════════════════════════════════════════════════╗
║        🚀 Bajarent Performance Audit                 ║
╚═══════════════════════════════════════════════════════╝
${colors.reset}`)

// Contadores
const stats = {
  totalFiles: 0,
  contextUsage: [] as string[],
  reduxUsage: [] as string[],
  specializedHooks: [] as string[],
  totalLines: 0
}

// Patterns a buscar
const patterns = {
  context: /useOrdersCtx/g,
  redux: /useOrdersRedux/g,
  specialized: /use(MyOrders|UnsolvedOrders|OrdersStats)/g
}

walkDir(srcDir, (filePath) => {
  stats.totalFiles++
  const content = readFileSync(filePath, 'utf-8')
  stats.totalLines += content.split('\n').length

  // Verificar uso de Context
  if (patterns.context.test(content)) {
    stats.contextUsage.push(filePath)
  }

  // Verificar uso de Redux
  if (patterns.redux.test(content)) {
    stats.reduxUsage.push(filePath)
  }

  // Verificar hooks especializados
  if (patterns.specialized.test(content)) {
    stats.specializedHooks.push(filePath)
  }
})

// Calcular porcentaje de migración
const totalComponents = stats.contextUsage.length + stats.reduxUsage.length
const migrationPercentage =
  totalComponents > 0
    ? ((stats.reduxUsage.length / totalComponents) * 100).toFixed(1)
    : 0

// Reportar resultados
console.log(`${colors.bold}📊 Estadísticas Generales${colors.reset}`)
console.log(
  `   Archivos analizados: ${colors.cyan}${stats.totalFiles}${colors.reset}`
)
console.log(
  `   Líneas de código: ${colors.cyan}${stats.totalLines.toLocaleString()}${
    colors.reset
  }`
)
console.log('')

console.log(`${colors.bold}🔄 Estado de Migración${colors.reset}`)
console.log(
  `   ${colors.red}❌ Context API (legacy):${colors.reset} ${colors.red}${stats.contextUsage.length} archivos${colors.reset}`
)
console.log(
  `   ${colors.green}✅ Redux Toolkit:${colors.reset} ${colors.green}${stats.reduxUsage.length} archivos${colors.reset}`
)
console.log(
  `   ${colors.blue}⚡ Hooks especializados:${colors.reset} ${colors.blue}${stats.specializedHooks.length} archivos${colors.reset}`
)
console.log('')

const progressBar =
  '█'.repeat(Math.floor(Number(migrationPercentage) / 5)) +
  '░'.repeat(20 - Math.floor(Number(migrationPercentage) / 5))
const color =
  Number(migrationPercentage) >= 80
    ? colors.green
    : Number(migrationPercentage) >= 50
    ? colors.yellow
    : colors.red

console.log(`${colors.bold}📈 Progreso de Migración${colors.reset}`)
console.log(
  `   [${color}${progressBar}${colors.reset}] ${color}${migrationPercentage}%${colors.reset}`
)
console.log('')

// Archivos pendientes de migración
if (stats.contextUsage.length > 0) {
  console.log(
    `${colors.bold}${colors.yellow}⚠️  Archivos pendientes de migración:${colors.reset}`
  )
  stats.contextUsage.forEach((file, index) => {
    const shortPath = file.replace('./src/', '')
    console.log(`   ${index + 1}. ${shortPath}`)
  })
  console.log('')
}

// Recomendaciones
console.log(`${colors.bold}💡 Recomendaciones${colors.reset}`)

if (Number(migrationPercentage) < 100) {
  console.log(
    `   ${colors.yellow}→${colors.reset} Migra los archivos pendientes a Redux`
  )
  console.log(
    `   ${colors.yellow}→${colors.reset} Prioriza: ScreenWorkshop.tsx, SpanOrder.tsx`
  )
  console.log(
    `   ${colors.yellow}→${colors.reset} Ver: PERFORMANCE_STATUS.md para detalles`
  )
} else {
  console.log(`   ${colors.green}✓${colors.reset} Migración completa! 🎉`)
  console.log(
    `   ${colors.green}→${colors.reset} Considera eliminar OrdersContextProvider`
  )
}

console.log('')

// Performance tips
console.log(`${colors.bold}⚡ Tips de Performance${colors.reset}`)
console.log(
  `   ${colors.cyan}→${colors.reset} Usa hooks especializados (useMyOrders, useUnsolvedOrders)`
)
console.log(
  `   ${colors.cyan}→${colors.reset} Cache: 5min por defecto, usa forceRefresh() solo cuando necesario`
)
console.log(
  `   ${colors.cyan}→${colors.reset} getPerformanceMetrics() en __DEV__ para debug`
)
console.log('')

// Exit code
process.exit(stats.contextUsage.length > 0 ? 1 : 0)
