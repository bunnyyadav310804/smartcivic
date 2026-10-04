/**
 * SmartCity AI Copilot Knowledge & Query Processing Engine
 * Handles natural language municipal queries, complaint drafting, and emergency help.
 */

export async function processCivicAIMessage(userQuery) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = userQuery.toLowerCase().trim()

      if (query.includes('pothole') || query.includes('road')) {
        resolve({
          reply: `🚧 **Road Infrastructure & Potholes:**
You can report road defects, broken asphalt, or deep potholes directly in the portal.
- **Assigned Dept:** Public Works Department (PWD).
- **Target SLA:** 24–48 hours for arterial roads.
- **Tip:** Include live camera photos and exact GPS coordinates for rapid field team dispatch.`,
          action: {
            label: 'Report Road Issue',
            route: '/complaints/new',
            draft: {
              category: 'Potholes / Road Damage',
              priority: 'High',
              title: 'Damaged Road Surface & Dangerous Pothole'
            }
          }
        })
      } else if (query.includes('garbage') || query.includes('waste') || query.includes('trash') || query.includes('clean')) {
        resolve({
          reply: `🗑️ **Solid Waste & Sanitation:**
For overflowing bins, unattended garbage dumps, or dead animal clearance:
- **Assigned Dept:** City Solid Waste Management Board.
- **Target SLA:** 12–24 hours.
- **Tip:** You can report anonymously if you prefer privacy.`,
          action: {
            label: 'Report Sanitation Issue',
            route: '/complaints/new',
            draft: {
              category: 'Garbage & Sanitation',
              priority: 'Medium',
              title: 'Uncollected Garbage Dump & Sanitation Cleanup'
            }
          }
        })
      } else if (query.includes('water') || query.includes('leak') || query.includes('pipe') || query.includes('drain')) {
        resolve({
          reply: `💧 **Water Supply & Drainage:**
Main drinking water leaks and clogged storm drains receive expedited emergency priority.
- **Assigned Dept:** Water Supply & Sewerage Board (BWSSB / Jal Board).
- **24/7 Helpline:** 1916 (Toll-Free).
- **Target SLA:** Under 12 hours for main pipeline breaches.`,
          action: {
            label: 'Report Water Leakage',
            route: '/complaints/new',
            draft: {
              category: 'Water Leakage',
              priority: 'High',
              title: 'Pressurized Municipal Water Pipeline Leak'
            }
          }
        })
      } else if (query.includes('light') || query.includes('dark') || query.includes('street light') || query.includes('lamp')) {
        resolve({
          reply: `💡 **Streetlighting & Public Safety:**
Non-functioning or damaged streetlights can create night-time safety hazards.
- **Assigned Dept:** City Electricity & Luminaire Maintenance Wing.
- **Target SLA:** 24–36 hours.`,
          action: {
            label: 'Report Broken Streetlight',
            route: '/complaints/new',
            draft: {
              category: 'Damaged Streetlights',
              priority: 'Medium',
              title: 'Defective Streetlight Fixture Causing Dark Zone'
            }
          }
        })
      } else if (query.includes('electric') || query.includes('wire') || query.includes('spark') || query.includes('shock') || query.includes('emergency')) {
        resolve({
          reply: `🚨 **EMERGENCY HAZARD ALERT:**
Live dangling wires and sparking transformers pose immediate life safety threats!
- **Immediate Action:** Keep pedestrians at least 15 meters away.
- **Disaster Helpline:** 112 / 1912 (Electricity Emergency).
- **Target SLA:** Immediate (Under 2 hours).`,
          action: {
            label: '🚨 Report Emergency Hazard',
            route: '/complaints/new',
            draft: {
              category: 'Electricity & Hazards',
              priority: 'Critical',
              title: 'CRITICAL: Exposed Live High-Voltage Wire Hazard'
            }
          }
        })
      } else if (query.includes('status') || query.includes('track') || query.includes('my complaint') || query.includes('check')) {
        resolve({
          reply: `📋 **Tracking Your Complaint:**
You can track real-time progress for all your submitted issues on the **Complaints Registry** page.
- Look for the step-by-step **Resolution Timeline**.
- Once resolved, you can view the official **Before-and-After proof photos** and export an **Official PDF Certificate**.`,
          action: {
            label: 'View Complaints Registry',
            route: '/complaints'
          }
        })
      } else if (query.includes('helpline') || query.includes('contact') || query.includes('phone') || query.includes('number')) {
        resolve({
          reply: `📞 **Municipal Emergency Helplines:**
- 🚨 **National Emergency:** 112
- 🚒 **Fire & Rescue:** 101
- 🚑 **Medical Emergency:** 108
- 💧 **Water Board Control Room:** 1916
- ⚡ **Electricity Emergency Wing:** 1912
- 🏛️ **Municipal Corporation Central Grievance:** 1800-425-5555`
        })
      } else if (query.includes('draft') || query.includes('write') || query.includes('help me report') || query.includes('create')) {
        resolve({
          reply: `✍️ **AI Complaint Drafting Assistant:**
I have prepared a structured draft for your civic issue report. You can click the button below to insert it directly into the issue submission form!`,
          action: {
            label: 'Open Form with AI Draft',
            route: '/complaints/new',
            draft: {
              title: 'Civic Infrastructure Concern Requiring Municipal Attention',
              description: 'Observed public infrastructure deterioration causing safety and health hazards. Requesting prompt inspection and municipal repair.',
              priority: 'High'
            }
          }
        })
      } else {
        resolve({
          reply: `🤖 **Hello! I am your SmartCity AI Civic Copilot.**
I can assist you with:
1. Identifying the correct municipal category & department for your issue.
2. Checking emergency helplines & department turnaround times (SLAs).
3. Automatically drafting complaint descriptions.
4. Explaining duplicate detection, karma points, and resolution proof verification.

How may I assist you today?`
        })
      }
    }, 450)
  })
}
