import { z } from 'zod';

// Define the UserName schema
const userNameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, 'First Name max length 20')
    .regex(/^[A-Z][a-z]*$/, 'First name must be capitalized')
    .nonempty('First name is required'),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .regex(/^[a-zA-Z]*$/, 'Last name must contain only alphabets')
    .nonempty('Last name is required'),
});

// Define the Guardian schema
const guardianSchema = z.object({
  fatherName: z.string().nonempty('Father name is required'),
  fatherOccupation: z.string().nonempty('Father occupation is required'),
  fatherContactNo: z.string().nonempty('Father contact number is required'),
  motherName: z.string().nonempty('Mother name is required'),
  motherOccupation: z.string().nonempty('Mother occupation is required'),
  motherContactNo: z.string().nonempty('Mother contact number is required'),
});

// Define the LocalGuardian schema
const localGuardianSchema = z.object({
  name: z.string().nonempty('Local guardian name is required'),
  occupation: z.string().nonempty('Local guardian occupation is required'),
  contactNo: z.string().nonempty('Local guardian contact number is required'),
  address: z.string().nonempty('Local guardian address is required'),
});

// Define the Student schema
const studentSchemaZOD = z.object({
  id: z.string().nonempty('ID is required'),
  name: userNameSchema,
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().optional(),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .nonempty('Email is required'),
  contactNo: z.string().nonempty({ message: 'Contact number is required' }),
  emergencyContactNo: z
    .string()
    .nonempty('Emergency contact number is required'),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string().nonempty('Present address is required'),
  permanentAddress: z.string().nonempty('Permanent address is required'),
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
});

export default studentSchemaZOD;
