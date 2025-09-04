import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { obtenerTodosGimnasios } from "../../api/gym";

export const useGimnasiosSelect = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["gimnasios-select"],
        queryFn: obtenerTodosGimnasios,
        staleTime: 1000 * 60 * 10,
        placeholderData: keepPreviousData,
        select: (response) => response.datos,
        retry: false
    });

    return {
        data,
        error,
        isLoading,
    };
};
