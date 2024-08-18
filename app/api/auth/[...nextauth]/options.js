import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcryptjs";
import User from '@db/models/user.model';
import { connectDb } from '@db';
import { logger } from '@utils/helpers/log';
import Employee from '@db/models/employee.model';

export const OPTIONS = {
  providers: [
    // Custom authentication provider using credentials
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      async authorize(credentials) {
        // Connect to the database
        await connectDb();

        try {
          // Find user by email
          const user = await User.findOne({ email: credentials?.email }) || await Employee.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("User not found");
          }

          // Check if the provided password matches the stored hashed password
          const passwordDontMatch = !(await bcrypt.compare(credentials.password, user.password))
          if (passwordDontMatch) {
            throw new Error("No matching password found");
          }

          // Return the user object if authentication is successful
          return user;
        } catch (err) {
          // Log the error and return null if authentication fails
          return logger(err.message);
        }
      },
      // The credentials object is undefined because we are not predefining the fields here
      credentials: undefined
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // 5 hour in seconds
    updateAge: 24 * 60 * 60,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  
  callbacks: {
    // Callback to handle session creation
    async session({ session, token }) {

      try {
        await connectDb();

        // Store the user credentials from MongoDB to session
        const sessionUser = await User.findOne({ email: session.user.email }) || await Employee.findOne({ email: session.user.email });

        session.user.id = sessionUser?._id.toString(); // Add user ID to session

        const company_id = sessionUser.company?._id || sessionUser?.companyId; // Add user ID to session

        session.user.companyId = company_id.toString();
        session.user.firstName = sessionUser.firstName; // Add user Name to session
        session.user.lastName = sessionUser.lastName; // Add user ID to session
        session.user.role = sessionUser?.role; // Add user role to session
        session.user.jobTitle = sessionUser?.jobTitle; // Add user role to session
        session.user.image = sessionUser.image; // Add user image to session
        session.user.expires = token.expires; // Attach the expiry time to the session object

        return session; // Return the modified session object
      } catch (error) {
        return logger('Something went wrong');
      }
    },

    // Callback to handle sign-in process
    async signIn({ credentials }) {
      try {
        // Return user credentials
        return credentials;
      } catch (error) {
        logger('Something went wrong');
        return false; // Return false if sign-in fails
      }
    },
  },
};