import { FaPlus } from "react-icons/fa"
import { NormalButton } from "../../components/Utiles/Buttons/NormalButton"
import PageHeader from "../../components/Utiles/Page/PageHeader"

const NivelAccesoPage = () => {
    return (
        <>
            <PageHeader
                title="Gestión de Niveles de Acceso"
                description="Administra los niveles de acceso de tu sistema"
                action={
                    <NormalButton
                        type="button"
                        // onClick={openAddModal}
                        tooltip="Agregar Nivel"
                    >
                        <FaPlus />
                        Agregar
                    </NormalButton>
                }
            />
        </>
    )
}

export default NivelAccesoPage


// // pages/NivelAccesoPage.jsx
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { FaPlus } from "react-icons/fa";
// import { MdDomainDisabled, MdRestartAlt } from "react-icons/md";
// import toast from "react-hot-toast";

// // Hooks
// import { useNivelesAcceso } from "../../hooks/useNivelesAcceso";

// // Componentes
// import NormalButton from "../../components/Utiles/Botones/NormalButton";
// import PageHeader from "../../components/Utiles/Pagina/PageHeader";
// import PageContent from "../../components/Utiles/Pagina/PageContent";
// import Loader from "../../components/Utiles/Loader/Loader";
// import LoadError from "../../components/Generales/ErrorCarga";
// import EstadoVacio from "../../components/Utiles/Pagina/EstadoVacio";
// import NivelAccesoList from "../../components/NivelAcceso/NivelAccesoList";
// import ProfessionalModal from "../../components/Utiles/Modales/Modal";
// import ConfirmationModal from "../../components/Utiles/Modales/ConfirmationModal";
// import NivelAccesoForm from "../../components/NivelAcceso/NivelAccesoForm";

// const NivelAccesoPage = () => {
//     const [estatus, setEstatus] = useState("ACTIVO");
//     const [search, setSearch] = useState(""); // Nota: actualmente no se usa para filtrar en el hook
//     const [page, setPage] = useState(0);
//     const pageSize = 3;

//     // Estados de modales
//     const [formModal, setFormModal] = useState({ isOpen: false, nivelAcceso: null });
//     const [deleteModal, setDeleteModal] = useState({ isOpen: false, nivelAcceso: null });
//     const [reactivateModal, setReactivateModal] = useState({ isOpen: false, nivelAcceso: null });

//     const handleCloseModals = useCallback(() => {
//         setFormModal({ isOpen: false, nivelAcceso: null });
//         setDeleteModal({ isOpen: false, nivelAcceso: null });
//         setReactivateModal({ isOpen: false, nivelAcceso: null });
//     }, []);

//     const {
//         nivelesQuery,
//         addNivel,
//         editNivel,
//         deactivateNivel,
//         reactivateNivel,
//         getNivelById,
//     } = useNivelesAcceso({ page, pageSize, estatus, onCloseModals: handleCloseModals, setEstatus });

//     // Reset paginación al cambiar filtros relevantes
//     useEffect(() => {
//         setPage(0);
//     }, [estatus]);

//     // Datos memoizados para evitar re-renders en lista
//     const nivelesAcceso = useMemo(
//         () => nivelesQuery.data?.datos?.content ?? [],
//         [nivelesQuery.data]
//     );

//     const pagination = useMemo(
//         () => ({
//             currentPage: nivelesQuery.data?.datos?.number ?? 0,
//             pageSize: nivelesQuery.data?.datos?.size ?? pageSize,
//             totalElements: nivelesQuery.data?.datos?.totalElements ?? 0,
//             totalPages: nivelesQuery.data?.datos?.totalPages ?? 0,
//         }),
//         [nivelesQuery.data, pageSize]
//     );

//     // Handlers memoizados
//     const openAddModal = useCallback(() => {
//         setFormModal({ isOpen: true, nivelAcceso: null });
//     }, []);

//     const openDeleteModal = useCallback((nivel) => {
//         setDeleteModal({ isOpen: true, nivelAcceso: nivel });
//     }, []);

//     const openReactivateModal = useCallback((nivel) => {
//         setReactivateModal({ isOpen: true, nivelAcceso: nivel });
//     }, []);

//     const onPageChange = useCallback((newPage) => setPage(newPage), []);

//     const handleAddNivel = useCallback(async (nivel) => {
//         await addNivel.mutateAsync(nivel);
//     }, [addNivel]);

//     const handleEditNivel = useCallback(async (nivel) => {
//         await editNivel.mutateAsync(nivel);
//     }, [editNivel]);

//     const handleEditClick = useCallback(
//         async (id) => {
//             try {
//                 const nivel = await getNivelById(id);
//                 setFormModal({ isOpen: true, nivelAcceso: nivel });
//             } catch (err) {
//                 toast.error(err?.message || "No se pudo cargar el nivel");
//             }
//         },
//         [getNivelById]
//     );

//     // Render states
//     if (nivelesQuery.isLoading) {
//         return <Loader message="Cargando niveles de acceso..." />;
//     }

//     if (nivelesQuery.isError) {
//         return (
//             <LoadError
//                 mensaje={nivelesQuery.error?.message || "Error al cargar los niveles"}
//                 onReintentar={() => nivelesQuery.refetch()}
//             />
//         );
//     }

//     const isEmpty = nivelesAcceso.length === 0;

//     return (
//         <>
//             <PageHeader
//                 title="Gestión de Niveles de Acceso"
//                 description="Administra los niveles de acceso de tu sistema"
//                 action={
//                     <NormalButton
//                         onClick={openAddModal}
//                         text="Agregar"
//                         icon={<FaPlus className="mr-2" />}
//                         tooltip="Agregar Nivel"
//                     />
//                 }
//             />

//             <PageContent>
//                 {isEmpty ? (
//                     <EstadoVacio
//                         type={search ? "search" : "empty"}
//                         title={search ? "No se encontraron niveles" : "No hay niveles"}
//                         description={
//                             search
//                                 ? `No hay resultados para "${search}"`
//                                 : estatus === "ACTIVO"
//                                     ? "Agrega tu primer nivel"
//                                     : "No hay niveles inactivos"
//                         }
//                         actionButton={
//                             estatus === "ACTIVO" && (
//                                 <NormalButton
//                                     onClick={openAddModal}
//                                     text="Agregar Nivel"
//                                     icon={<FaPlus className="mr-2" />}
//                                 />
//                             )
//                         }
//                     />
//                 ) : (
//                     <NivelAccesoList
//                         niveles={nivelesAcceso}
//                         pagination={pagination}
//                         onAdd={openAddModal}
//                         onEdit={(nivel) => handleEditClick(nivel.id)}
//                         onDelete={openDeleteModal}
//                         onReactivate={openReactivateModal}
//                         onPageChange={onPageChange}
//                     />
//                 )}
//             </PageContent>

//             {/* Modales */}
//             <ProfessionalModal
//                 isOpen={formModal.isOpen}
//                 onClose={handleCloseModals}
//                 size="2xl"
//                 title={formModal.nivelAcceso ? "Editar Nivel" : "Agregar Nivel"}
//             >
//                 <NivelAccesoForm
//                     nivelAccesoExistente={formModal.nivelAcceso}
//                     onAdd={handleAddNivel}
//                     onEdit={handleEditNivel}
//                     onCancel={handleCloseModals}
//                 />
//             </ProfessionalModal>

//             <ConfirmationModal
//                 isOpen={deleteModal.isOpen}
//                 onClose={handleCloseModals}
//                 onConfirm={() => deactivateNivel.mutateAsync(deleteModal.nivelAcceso.id)}
//                 title="Desactivar Nivel"
//                 message={`¿Desactivar "${deleteModal.nivelAcceso?.nombre}"?`}
//                 confirmText="Desactivar"
//                 iconConfirm={<MdDomainDisabled />}
//             />

//             <ConfirmationModal
//                 isOpen={reactivateModal.isOpen}
//                 onClose={handleCloseModals}
//                 onConfirm={() => reactivateNivel.mutateAsync(reactivateModal.nivelAcceso.id)}
//                 title="Reactivar Nivel"
//                 message={`¿Reactivar "${reactivateModal.nivelAcceso?.nombre}"?`}
//                 confirmText="Reactivar"
//                 iconConfirm={<MdRestartAlt />}
//             />
//         </>
//     );
// };

// export default NivelAccesoPage;
