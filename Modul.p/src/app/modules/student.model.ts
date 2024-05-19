import { Aggregate, Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentMethods,
  StudentModel,
  TUserName,
} from './student/student.interface';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'First Name max length 20'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not a valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  fatherContactNo: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
});

const localGuradianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>(
  {
    id: { type: String, required: true, unique: true },
    name: {
      type: userNameSchema,
      required: true,
    },
    password: { type: String, required: true },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUES} is not a valid gender',
      },
      required: [true, 'Gender in requirements'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a ValidEmail address.',
      },
    },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloogGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddres: { type: String, required: true },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian in required'],
    },
    localGuardian: {
      type: localGuradianSchema,
      required: [true, 'LocalGuardian in required'],
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

//virtual
studentSchema.virtual('fullName').get(function () {
  return this.name.firstName + this.name.middleName + this.name.lastName;
});

// pre save middleware // hook : will work on create
studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre: we will save pre data');
  //after DB save data hashing password
  const user = this;
  // Check if the password field is modified
  if (!user.isModified('password')) {
    return next();
  }
  user.password = await bcrypt.hash(user.password, 12);
  next();
});

// post save middleware // hooks
studentSchema.post('save', function (doc, next) {
  // console.log(this, 'post: we saved our data');
  doc.password = '';
  next();
});

//Query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

// instance methods
studentSchema.methods.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
