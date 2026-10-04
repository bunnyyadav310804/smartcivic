/**
 * AI Hazard & Emergency Escalation Engine
 * Scans complaint descriptions and keywords for life-safety threats.
 */

const EMERGENCY_KEYWORDS = [
  { trigger: 'live wire', reason: 'High-Voltage Electrocution Risk', department: 'Electricity Board Emergency Wing' },
  { trigger: 'sparking', reason: 'Electrical Fire & Shock Hazard', department: 'Electricity Board Disaster Unit' },
  { trigger: 'hanging wire', reason: 'Pedestrian Electrocution Hazard', department: 'Electricity Emergency Wing' },
  { trigger: 'open manhole', reason: 'Fatal Fall & Vehicle Inversion Hazard', department: 'Sewerage & Traffic Safety Unit' },
  { trigger: 'gas leak', reason: 'Combustion & Toxic Inhalation Threat', department: 'Municipal Disaster Management' },
  { trigger: 'bridge crack', reason: 'Structural Collapse Risk', department: 'Bridge & Highway Engineering Wing' },
  { trigger: 'collapsed wall', reason: 'Debris Impact Danger', department: 'Disaster Relief Wing' },
  { trigger: 'flooding hospital', reason: 'Critical Facility Disruption', department: 'Emergency Flood Management' },
  { trigger: 'school flood', reason: 'Child Safety Threat', department: 'Emergency Flood Management' }
]

export function evaluateHazardUrgency(title = '', description = '') {
  const combined = `${title} ${description}`.toLowerCase()

  for (const item of EMERGENCY_KEYWORDS) {
    if (combined.includes(item.trigger)) {
      return {
        isEmergency: true,
        triggerWord: item.trigger,
        hazardReason: item.reason,
        recommendedDepartment: item.department,
        recommendedPriority: 'Critical',
        helpline: '112 / 1912'
      }
    }
  }

  return {
    isEmergency: false
  }
}
