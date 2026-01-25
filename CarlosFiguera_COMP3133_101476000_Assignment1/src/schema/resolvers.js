const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { cloudinary } = require('../config/cloudinary');
const { signToken, requireAuth } = require('../utils/auth');
const { badRequest, conflict, notFound } = require('../utils/errors');
const {
  requireNonEmpty,
  validateEmail,
  validatePassword,
  validateSalary,
  validateGender,
  validateDate,
  validateAtLeastOne,
  collectErrors
} = require('../utils/validators');

function toEmployee(doc) {
  if (!doc) return null;
  return {
    ...doc.toObject(),
    date_of_joining: doc.date_of_joining.toISOString(),
    created_at: doc.created_at.toISOString(),
    updated_at: doc.updated_at.toISOString()
  };
}

function toUser(doc) {
  if (!doc) return null;
  return {
    ...doc.toObject(),
    created_at: doc.created_at.toISOString(),
    updated_at: doc.updated_at.toISOString()
  };
}

async function uploadPhoto(dataUri) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'comp3133_assignment1';
  if (!cloudName || !apiKey || !apiSecret) {
    throw badRequest('Cloudinary credentials are missing in environment variables');
  }
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    overwrite: true
  });
  return result.secure_url;
}

const resolvers = {
  Query: {
    login: async (_, args) => {
      const errors = collectErrors([
        requireNonEmpty(args.usernameOrEmail, 'usernameOrEmail'),
        requireNonEmpty(args.password, 'password')
      ]);
      if (errors) throw badRequest('Validation failed', errors);

      const identifier = args.usernameOrEmail.trim();
      const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
      });

      if (!user) {
        return { success: false, message: 'Invalid credentials', token: null, user: null };
      }

      const ok = await bcrypt.compare(args.password, user.password);
      if (!ok) {
        return { success: false, message: 'Invalid credentials', token: null, user: null };
      }

      const token = signToken(user);
      return { success: true, message: 'Login successful', token, user: toUser(user) };
    },

    getAllEmployees: async (_, __, ctx) => {
      requireAuth(ctx);
      const employees = await Employee.find().sort({ created_at: -1 });
      return { success: true, message: 'Employees fetched', employees: employees.map(toEmployee) };
    },

    searchEmployeeByEid: async (_, { eid }, ctx) => {
      requireAuth(ctx);
      if (!eid) throw badRequest('eid is required');
      const employee = await Employee.findById(eid);
      if (!employee) return { success: false, message: 'Employee not found', employee: null };
      return { success: true, message: 'Employee fetched', employee: toEmployee(employee) };
    },

    searchEmployees: async (_, { designation, department }, ctx) => {
      requireAuth(ctx);
      const err = validateAtLeastOne({ designation, department });
      if (err) throw badRequest(err);

      const filter = {};
      if (designation && designation.trim().length) filter.designation = { $regex: designation.trim(), $options: 'i' };
      if (department && department.trim().length) filter.department = { $regex: department.trim(), $options: 'i' };

      const employees = await Employee.find(filter).sort({ created_at: -1 });
      return { success: true, message: 'Employees fetched', employees: employees.map(toEmployee) };
    }
  },

  Mutation: {
    signup: async (_, { input }) => {
      const errors = collectErrors([
        requireNonEmpty(input.username, 'username'),
        validateEmail(input.email),
        validatePassword(input.password)
      ]);
      if (errors) throw badRequest('Validation failed', errors);

      const username = input.username.trim();
      const email = input.email.toLowerCase().trim();

      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) throw conflict('Username or email already exists');

      const hashed = await bcrypt.hash(input.password, 10);
      const user = await User.create({ username, email, password: hashed });
      const token = signToken(user);

      return { success: true, message: 'Signup successful', token, user: toUser(user) };
    },

    addNewEmployee: async (_, { input }, ctx) => {
      requireAuth(ctx);
      const errors = collectErrors([
        requireNonEmpty(input.first_name, 'first_name'),
        requireNonEmpty(input.last_name, 'last_name'),
        validateEmail(input.email),
        validateGender(input.gender || 'Other'),
        requireNonEmpty(input.designation, 'designation'),
        validateSalary(input.salary),
        validateDate(input.date_of_joining, 'date_of_joining'),
        requireNonEmpty(input.department, 'department'),
        requireNonEmpty(input.employee_photo, 'employee_photo')
      ]);
      if (errors) throw badRequest('Validation failed', errors);

      const exists = await Employee.findOne({ email: input.email.toLowerCase().trim() });
      if (exists) throw conflict('Employee email already exists');

      const photoUrl = await uploadPhoto(input.employee_photo);

      const employee = await Employee.create({
        first_name: input.first_name.trim(),
        last_name: input.last_name.trim(),
        email: input.email.toLowerCase().trim(),
        gender: input.gender || 'Other',
        designation: input.designation.trim(),
        salary: Number(input.salary),
        date_of_joining: new Date(input.date_of_joining),
        department: input.department.trim(),
        employee_photo: photoUrl
      });

      return { success: true, message: 'Employee created', employee: toEmployee(employee) };
    },

    updateEmployeeByEid: async (_, { eid, input }, ctx) => {
      requireAuth(ctx);
      if (!eid) throw badRequest('eid is required');

      const employee = await Employee.findById(eid);
      if (!employee) throw notFound('Employee not found');

      const errors = collectErrors([
        input.email != null ? validateEmail(input.email) : null,
        input.gender != null ? validateGender(input.gender) : null,
        input.salary != null ? validateSalary(input.salary) : null,
        input.date_of_joining != null ? validateDate(input.date_of_joining, 'date_of_joining') : null
      ]);
      if (errors) throw badRequest('Validation failed', errors);

      if (input.email != null) {
        const email = input.email.toLowerCase().trim();
        if (email !== employee.email) {
          const exists = await Employee.findOne({ email });
          if (exists) throw conflict('Employee email already exists');
          employee.email = email;
        }
      }

      if (input.first_name != null) employee.first_name = input.first_name.trim();
      if (input.last_name != null) employee.last_name = input.last_name.trim();
      if (input.gender != null) employee.gender = input.gender;
      if (input.designation != null) employee.designation = input.designation.trim();
      if (input.salary != null) employee.salary = Number(input.salary);
      if (input.date_of_joining != null) employee.date_of_joining = new Date(input.date_of_joining);
      if (input.department != null) employee.department = input.department.trim();

      if (input.employee_photo != null && String(input.employee_photo).trim().length) {
        const photoUrl = await uploadPhoto(input.employee_photo);
        employee.employee_photo = photoUrl;
      }

      await employee.save();
      return { success: true, message: 'Employee updated', employee: toEmployee(employee) };
    },

    deleteEmployeeByEid: async (_, { eid }, ctx) => {
      requireAuth(ctx);
      if (!eid) throw badRequest('eid is required');
      const employee = await Employee.findById(eid);
      if (!employee) return { success: false, message: 'Employee not found', deleted_id: null };
      await Employee.deleteOne({ _id: eid });
      return { success: true, message: 'Employee deleted', deleted_id: eid };
    }
  }
};

module.exports = { resolvers };
