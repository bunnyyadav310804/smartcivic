import { getAllUsers, loginUser, registerUser } from '../services/authService.js'

function validateRequiredFields(fields) {
  return fields.every((field) => typeof field === 'string' && field.trim().length > 0)
}

function sendAuthResponse(response, payload, statusCode) {
  return response.status(statusCode).json(payload)
}

export async function register(request, response) {
  const { name, email, phone, password, role } = request.body

  if (!validateRequiredFields([name, email, phone, password])) {
    return sendAuthResponse(response, { message: 'All required fields must be provided' }, 400)
  }

  try {
    const authData = await registerUser({ name, email, phone, password, role })
    return sendAuthResponse(response, authData, 201)
  } catch (error) {
    return sendAuthResponse(response, { message: error.message || 'Registration failed' }, error.statusCode || 500)
  }
}

export async function login(request, response) {
  const { email, password } = request.body

  if (!validateRequiredFields([email, password])) {
    return sendAuthResponse(response, { message: 'Email and password are required' }, 400)
  }

  try {
    const authData = await loginUser({ email, password })
    return sendAuthResponse(response, authData, 200)
  } catch (error) {
    return sendAuthResponse(response, { message: error.message || 'Login failed' }, error.statusCode || 500)
  }
}

export async function me(request, response) {
  const user = request.user

  if (!user) {
    return sendAuthResponse(response, { message: 'User not found' }, 404)
  }

  return sendAuthResponse(
    response,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    },
    200
  )
}

export async function getUsers(request, response) {
  if (request.user?.role !== 'Admin') {
    return sendAuthResponse(response, { message: 'Access denied. Admin only.' }, 403)
  }

  try {
    const users = await getAllUsers()
    return sendAuthResponse(response, { users }, 200)
  } catch (error) {
    return sendAuthResponse(response, { message: error.message || 'Unable to fetch users' }, error.statusCode || 500)
  }
}