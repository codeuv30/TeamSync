import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginEmployee, registerEmployee } from "../state/auth/authAction";

export const useAuth = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onRegisterSubmit = (data) => {
    dispatch(registerEmployee(data));
  };

  const onLoginSubmit = (data) => {
    dispatch(loginEmployee(data));
  };

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    touchedFields,
    dirtyFields,
    onRegisterSubmit,
    onLoginSubmit,
  };
};

export default useAuth;
