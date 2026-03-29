import { AuthenticationError } from 'apollo-server-express';

export const resolvers = {
  Query: {
    currentUser: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
      // Return current user from database
      return context.user;
    },

    employees: async (
      _: any,
      { department, position }: { department?: string; position?: string },
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
      // Fetch employees from MongoDB with optional filters
      // const query: any = {};
      // if (department) query.department = department;
      // if (position) query.position = position;
      // return await Employee.find(query);
      return [];
    },

    employee: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
      // Fetch single employee from MongoDB
      // return await Employee.findById(id);
      return null;
    },

    searchEmployees: async (
      _: any,
      { query }: { query: string },
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
      // Search employees in MongoDB
      // return await Employee.find({
      //   $or: [
      //     { firstName: { $regex: query, $options: 'i' } },
      //     { lastName: { $regex: query, $options: 'i' } },
      //     { email: { $regex: query, $options: 'i' } }
      //   ]
      // });
      return [];
    },
  },

  Mutation: {
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      // Validate credentials and generate JWT token
      // const user = await User.findOne({ email });
      // if (!user || !await bcrypt.compare(password, user.password)) {
      //   throw new AuthenticationError('Invalid credentials');
      // }
      // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      // return { token, user };
      throw new Error('Not implemented');
    },

    signup: async (
      _: any,
      {
        email,
        password,
        firstName,
        lastName,
      }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      }
    ) => {
      // Create new user in MongoDB and generate JWT token
      throw new Error('Not implemented');
    },

    logout: async (_: any, __: any, context: any) => {
      // Invalidate token or clear session
      return true;
    },

    createEmployee: async (
      _: any,
      {
        firstName,
        lastName,
        email,
        phone,
        department,
        position,
        salary,
        joinDate,
        address,
        city,
        country,
        profilePicture,
      }: any,
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
      // Create new employee in MongoDB
      // const employee = new Employee({
      //   firstName,
      //   lastName,
      //   email,
      //   phone,
      //   department,
      //   position,
      //   salary,
      //   joinDate,
      //   address,
      //   city,
      //   country,
      //   profilePicture
      // });
      // await employee.save();
      // return employee;
      throw new Error('Not implemented');
    },

    updateEmployee: async (
      _: any,
      { id, ...updates }: any,
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
      // Update employee in MongoDB
      // return await Employee.findByIdAndUpdate(id, updates, { new: true });
      throw new Error('Not implemented');
    },

    deleteEmployee: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('User not authenticated');
      }
      // Delete employee from MongoDB
      // return await Employee.findByIdAndDelete(id);
      throw new Error('Not implemented');
    },
  },
};
