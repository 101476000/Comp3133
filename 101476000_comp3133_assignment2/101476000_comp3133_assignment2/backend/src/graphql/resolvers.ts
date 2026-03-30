import { AuthenticationError, UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Employee } from '../models/Employee';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token: string): any {
    try {
          return jwt.verify(token, JWT_SECRET);
    } catch {
          return null;
    }
}

export const resolvers = {
    Query: {
          currentUser: async (_: any, __: any, context: any) => {
                  if (!context.user) throw new AuthenticationError('User not authenticated');
                  return await User.findById(context.user.userId);
          },

          employees: async (
                  _: any,
            { department, position }: { department?: string; position?: string },
                  context: any
                ) => {
                  if (!context.user) throw new AuthenticationError('User not authenticated');
                  const query: any = {};
                  if (department) query.department = department;
                  if (position) query.position = position;
                  return await Employee.find(query).sort({ createdAt: -1 });
          },

          employee: async (_: any, { id }: { id: string }, context: any) => {
                  if (!context.user) throw new AuthenticationError('User not authenticated');
                  const emp = await Employee.findById(id);
                  if (!emp) throw new UserInputError('Employee not found');
                  return emp;
          },

          searchEmployees: async (_: any, { query }: { query: string }, context: any) => {
                  if (!context.user) throw new AuthenticationError('User not authenticated');
                  return await Employee.find({
                            $or: [
                              { firstName: { $regex: query, $options: 'i' } },
                              { lastName: { $regex: query, $options: 'i' } },
                              { email: { $regex: query, $options: 'i' } },
                                      ],
                  }).sort({ createdAt: -1 });
          },
    },

    Mutation: {
          login: async (_: any, { email, password }: { email: string; password: string }) => {
                  const user = await User.findOne({ email: email.toLowerCase() });
                  if (!user) throw new AuthenticationError('Invalid email or password');
                  const valid = await user.comparePassword(password);
                  if (!valid) throw new AuthenticationError('Invalid email or password');
                  const token = generateToken(user._id.toString());
                  return { token, user };
          },

          signup: async (
                  _: any,
            { email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string }
                ) => {
                  const existing = await User.findOne({ email: email.toLowerCase() });
                  if (existing) throw new UserInputError('User already exists with this email');
                  const user = new User({ email, password, firstName, lastName });
                  await user.save();
                  const token = generateToken(user._id.toString());
                  return { token, user };
          },

          logout: async () => true,

          createEmployee: async (_: any, args: any, context: any) => {
                  if (!context.user) throw new AuthenticationError('User not authenticated');
                  const existing = await Employee.findOne({ email: args.email.toLowerCase() });
                  if (existing) throw new UserInputError('Employee with this email already exists');
                  const employee = new Employee(args);
                  await employee.save();
                  return employee;
          },

          updateEmployee: async (_: any, { id, ...updates }: any, context: any) => {
                  if (!context.user) throw new AuthenticationError('User not authenticated');
                  const employee = await Employee.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
                  if (!employee) throw new UserInputError('Employee not found');
                  return employee;
          },

          deleteEmployee: async (_: any, { id }: { id: string }, context: any) => {
                  if (!context.user) throw new AuthenticationError('User not authenticated');
                  const employee = await Employee.findByIdAndDelete(id);
                  if (!employee) throw new UserInputError('Employee not found');
                  return employee;
          },
    },
};

export { verifyToken };
