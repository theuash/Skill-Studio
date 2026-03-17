import {
  Globe,
  BarChart3,
  Brain,
  Smartphone,
  Cloud,
  Lock,
  Palette,
  Link2,
  Gamepad2,
  Wrench,
} from 'lucide-react'

// Map sector IDs to their icon components
export const SECTOR_ICON_MAP = {
  'web-development': Globe,
  'data-science': BarChart3,
  'ai-ml': Brain,
  'mobile-development': Smartphone,
  'cloud-devops': Cloud,
  'cybersecurity': Lock,
  'ui-ux-design': Palette,
  'blockchain': Link2,
  'game-development': Gamepad2,
  'embedded-systems': Wrench,
}

// Get icon component for a sector
export const getSectorIcon = (sectorId) => {
  return SECTOR_ICON_MAP[sectorId] || Globe
}

// Render icon with styling
export const SectorIcon = ({ sectorId, size = 20, color = '#6C63FF' }) => {
  const IconComponent = getSectorIcon(sectorId)
  return <IconComponent size={size} color={color} strokeWidth={2} />
}
