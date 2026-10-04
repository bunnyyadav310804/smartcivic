import User from '../models/User.js'

export async function seedDefaultAdmin() {
  try {
    const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@smartcity.gov').toLowerCase().trim()
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'

    const existingAdmin = await User.findOne({ email: adminEmail }).select('+password')
    if (!existingAdmin) {
      await User.create({
        name: 'Municipal Administrator',
        email: adminEmail,
        phone: '9876543210',
        password: adminPassword,
        role: 'Admin'
      })
      console.log(`✓ Default admin account created: ${adminEmail}`)
    } else {
      let needsSave = false
      if (existingAdmin.role !== 'Admin') {
        existingAdmin.role = 'Admin'
        needsSave = true
      }
      const isPasswordValid = await existingAdmin.comparePassword(adminPassword).catch(() => false)
      if (!isPasswordValid) {
        existingAdmin.password = adminPassword
        needsSave = true
      }
      if (needsSave) {
        await existingAdmin.save()
        console.log(`✓ Default admin account synchronized: ${adminEmail}`)
      }
    }
  } catch (error) {
    console.error('Admin seeder notice:', error.message)
  }
}

