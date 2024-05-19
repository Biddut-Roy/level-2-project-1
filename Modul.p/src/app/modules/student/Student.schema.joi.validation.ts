//  Joi schema create

import Joi from 'joi';

const userNameJoiSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .pattern(/^[A-Z][a-z]*$/, '{VALUE} is not in capitalize format')
    .required(),
  middleName: Joi.string().allow(null, ''),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z]*$/, '{VALUE} is not a valid')
    .required(),
});

const guardianJoiSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
});

const localGuardianJoiSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

export const studentJoiSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameJoiSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.string(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianJoiSchema.required(),
  localGuardian: localGuardianJoiSchema.required(),
  profileImg: Joi.string().allow(null, ''),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
});
// End joi schema
