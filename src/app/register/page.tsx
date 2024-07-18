import prisma from "@/utils/PrismaClient";
import registerSchema from "@/validation/registerSchema";
import RegisterForm from "@/components/forms/RegisterForm";


const RegisterPage = () => {

  return (
    <div className="flex justify-center mt-32">
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
