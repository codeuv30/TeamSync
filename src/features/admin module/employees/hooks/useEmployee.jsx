import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllEmployees } from "../api/EmployeeApi";

const useEmployee = (params) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["employees", params],
    queryFn: () => getAllEmployees(params),
    staleTime: 10000,
    placeholderData: keepPreviousData,
  });

  return {
    isPending,
    isError,
    error,
    data,
  };
};

export default useEmployee;