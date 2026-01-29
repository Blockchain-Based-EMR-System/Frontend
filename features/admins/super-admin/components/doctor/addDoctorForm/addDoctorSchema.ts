import { z } from "zod";

export const addDoctorSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["MALE", "FEMALE"]),
  date_of_birth: z.string().min(1, "Date of birth is required"),
});
