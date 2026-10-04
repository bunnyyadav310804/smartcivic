import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Submitted',
      trim: true
    },
    priority: {
      type: String,
      default: 'Medium',
      trim: true
    },
    department: {
      type: String,
      trim: true,
      default: 'City Operations Cell'
    },
    departmentMembers: [
      {
        name: {
          type: String,
          trim: true,
          default: ''
        },
        phone: {
          type: String,
          trim: true,
          default: ''
        },
        role: {
          type: String,
          trim: true,
          default: ''
        }
      }
    ],
    remarks: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    resolutionImages: {
      type: [String],
      default: []
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
      },
      comment: {
        type: String,
        trim: true,
        default: ''
      },
      submittedAt: {
        type: Date,
        default: null
      },
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      }
    },
    timeline: [
      {
        status: {
          type: String,
          required: true
        },
        remarks: {
          type: String,
          default: ''
        },
        action: {
          type: String,
          default: 'Status Update'
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    upvotes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

complaintSchema.virtual('upvoteCount').get(function () {
  return Array.isArray(this.upvotes) ? this.upvotes.length : 0
})

export default mongoose.model('Complaint', complaintSchema)