export const DEPARTMENT_TEAM_MAP = {
  'Potholes / Road Damage': {
    department: 'Roads & Transport Department',
    members: [
      { name: 'Ravi Kumar', phone: '+91 98765 43210', role: 'Road Engineer' },
      { name: 'Anita Verma', phone: '+91 98765 43211', role: 'Maintenance Supervisor' }
    ]
  },
  'Garbage & Sanitation': {
    department: 'Sanitation Department',
    members: [
      { name: 'Suresh Patil', phone: '+91 98765 43212', role: 'Sanitation Officer' },
      { name: 'Meena Iyer', phone: '+91 98765 43213', role: 'Waste Crew Lead' }
    ]
  },
  'Drainage Blockage': {
    department: 'Storm Water Management',
    members: [
      { name: 'Dinesh Rao', phone: '+91 98765 43214', role: 'Drainage Engineer' },
      { name: 'Kavya Nair', phone: '+91 98765 43215', role: 'Field Technician' }
    ]
  },
  'Water Leakage': {
    department: 'Water Supply Department',
    members: [
      { name: 'Harish Yadav', phone: '+91 98765 43216', role: 'Water Utility Supervisor' },
      { name: 'Priya Singh', phone: '+91 98765 43217', role: 'Pipeline Response Team' }
    ]
  },
  'Damaged Streetlights': {
    department: 'Electrical Maintenance Division',
    members: [
      { name: 'Vikram Shah', phone: '+91 98765 43218', role: 'Lighting Technician' },
      { name: 'Asha Reddy', phone: '+91 98765 43219', role: 'Grid Maintenance Lead' }
    ]
  },
  'Electricity & Hazards': {
    department: 'Power & Safety Unit',
    members: [
      { name: 'Nitin Joshi', phone: '+91 98765 43220', role: 'Power Safety Officer' },
      { name: 'Swathi Rao', phone: '+91 98765 43221', role: 'Hazard Response Team' }
    ]
  },
  Roads: {
    department: 'Roads & Transport Department',
    members: [
      { name: 'Ravi Kumar', phone: '+91 98765 43210', role: 'Road Engineer' },
      { name: 'Anita Verma', phone: '+91 98765 43211', role: 'Maintenance Supervisor' }
    ]
  },
  Sanitation: {
    department: 'Sanitation Department',
    members: [
      { name: 'Suresh Patil', phone: '+91 98765 43212', role: 'Sanitation Officer' },
      { name: 'Meena Iyer', phone: '+91 98765 43213', role: 'Waste Crew Lead' }
    ]
  },
  Water: {
    department: 'Water Supply Department',
    members: [
      { name: 'Harish Yadav', phone: '+91 98765 43216', role: 'Water Utility Supervisor' },
      { name: 'Priya Singh', phone: '+91 98765 43217', role: 'Pipeline Response Team' }
    ]
  },
  Electricity: {
    department: 'Electrical Maintenance Division',
    members: [
      { name: 'Vikram Shah', phone: '+91 98765 43218', role: 'Lighting Technician' },
      { name: 'Asha Reddy', phone: '+91 98765 43219', role: 'Grid Maintenance Lead' }
    ]
  },
  Other: {
    department: 'City Operations Cell',
    members: [
      { name: 'Arun Babu', phone: '+91 98765 43222', role: 'Operations Coordinator' },
      { name: 'Sonia Das', phone: '+91 98765 43223', role: 'Field Support Lead' }
    ]
  }
}

export function getDepartmentTeam(category) {
  const resolved = DEPARTMENT_TEAM_MAP[category] || DEPARTMENT_TEAM_MAP.Other
  return {
    department: resolved.department,
    members: resolved.members.map((member) => ({ ...member }))
  }
}
