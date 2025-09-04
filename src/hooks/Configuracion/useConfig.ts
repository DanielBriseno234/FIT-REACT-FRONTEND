import {
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { useConfigStore } from '../../store/configStore';

const useConfig = () => {
  const queryClient = useQueryClient();
  const cargarConfig = useConfigStore(state => state.cargarConfig);

  // Queries
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['configuracion'],
    queryFn: cargarConfig,
    staleTime: 1000 * 60 * 5,
    retry: false
  });

  const invalidateConfig = () => {
    queryClient.invalidateQueries({ queryKey: ['configuracion'] });
  };

  const isFirstLoading = isLoading && !data;

  return {
    config: data?.datos,
    isFirstLoading,
    isLoading,
    error,
    refetch,
    invalidateConfig
  }
}

export default useConfig
