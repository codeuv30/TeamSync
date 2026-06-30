import { axiosInstance } from "../../../../config/axiosInstance";

// NOTE: this matches the backend's actual contract — it only checks
// truthiness on each filter field (`if (role) filter.role = role`),
// so "" (empty string) is the only value that means "no filter".
// Sending "all" here would make the backend search for role==="all"
// literally and return zero results.
export const getAllEmployees = async ({
  page = 1,
  search = "",
  role = "",
  department = "",
  status = "",
  limit = 20,
} = {}) => {
  const response = await axiosInstance.get("/employee", {
    params: { page, search, role, department, status, limit },
  });
  return response.data.data;
};

export const createEmployee = async (data) => {
  try {
    const formattedData = {
      name: data.name,
      email: data.email,
      password: data.password,
      bio: data.bio,
      department: data.department.toString().toLowerCase(),
      role: data.role.toString().toLowerCase(),
      joiningDate: data.joiningDate,
      status: data.status,
      photo: data.photo
    }

    const response = await axiosInstance.post("/employee/create", formattedData);

    alert(response.data.message);

    return response.data.data;
  } catch (error) {
    console.log("error in create employee api", error);
  }
}

export const updateEmployee = async (employeeId, data) => {
  try {
    
    const response = await axiosInstance.patch(`/employee/update/${employeeId}`, data);

    console.log(response);

    alert(response.data.message);

    return response.data;

  } catch (error) {
    console.log("Erorr in api", error);
  }
}

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axiosInstance.delete(`/employee/delete/${employeeId}`);

    alert(response.data.message)

    return response.data;
  } catch (error) {
    console.log('error in api', error);
  }
}

export const markEmployeeInactive = async (employeeId, status) => {
  try {
    const response = await axiosInstance.patch(`/employee/update/${employeeId}`, { status });

    alert(response.data.message)

    return response.data;
  } catch (error) {
    console.log('error in api', error);
  }
}