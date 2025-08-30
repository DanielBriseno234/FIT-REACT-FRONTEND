import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ConfiguracionInputType } from '../interfaces/Configuracion/Configuracion';
//import { modificarConfig } from '../api/config';
import { useConfigStore } from '../store/configStore';

export const useConfigMutations = () => {
    const queryClient = useQueryClient();
    const modificarConfig = useConfigStore(state => state.modificarConfig);

    const updateConfigMutation = useMutation({
        mutationFn: (data: ConfiguracionInputType) => modificarConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['configuracion'] });
        },
    });

    return {
        updateConfig: updateConfigMutation.mutateAsync,
        isUpdating: updateConfigMutation.isPending
    };
}