
const NivelAccesoDetallePage = () => {
    return (
        <div>
            Detalles
        </div>
    )
}

export default NivelAccesoDetallePage

// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import Loader from "../../components/Utiles/Loader/Loader";
// import LoadError from "../../components/Generales/ErrorCarga";
// import NivelAccesoDetails from "../../components/NivelAcceso/NivelAccesoDetails";
// import { obtenerNivelAccesoEspecifico } from "../../api/nivelAcceso"; // Asegúrate de tener esta función en tu API

// const NivelAccesoDetallePage = () => {
//     const { id } = useParams();

//     // Consulta para obtener el nivel de acceso
//     const {
//         data: nivelAcceso,
//         isLoading,
//         isError,
//         error,
//         refetch,
//     } = useQuery({
//         queryKey: ["nivelAcceso", id],
//         queryFn: () => obtenerNivelAccesoEspecifico(id),
//         enabled: !!id, // Solo ejecuta si hay un ID válido
//     });

//     // Render states
//     if (isLoading) {
//         return <Loader message="Cargando detalles del nivel de acceso..." />;
//     }

//     if (isError) {
//         return (
//             <LoadError
//                 titulo="Error al cargar la información del nivel de acceso"
//                 mensaje={error.message || "Ocurrió un error inesperado"}
//                 textoBoton="Reintentar"
//                 onReintentar={refetch} // React Query maneja el reintento automáticamente
//             />
//         );
//     }

//     return <NivelAccesoDetails nivelAcceso={nivelAcceso?.datos} />;
// };

// export default NivelAccesoDetallePage;