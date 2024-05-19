import { Student } from '../student.model';
import { TStudent } from './student.interface';

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student);
  // return result;

  // static method instance

  const student = new Student(studentData); // create an instances
  if (await student.isUserExist(studentData.id)) {
    throw new Error('Student already exists');
  }

  const result = await student.save(); //build in instance method
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};

const deleteSingleStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDelete: true });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
