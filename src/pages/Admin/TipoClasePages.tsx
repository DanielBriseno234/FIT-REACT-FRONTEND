import PageHeader from '../../components/Utiles/Page/PageHeader'
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react';
import { useTiposClases } from '../../hooks/TipoClase/useTiposClases';
import { useTipoClaseMutations } from '../../hooks/TipoClase/useTipoClaseMutations';
import type { TipoClaseInput, TipoClaseItem, TipoClaseOutput } from '../../interfaces/TipoClase/TipoClase';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../helpers/errorHelper';
import Loader from '../../components/Utiles/Loader/Loader';
import LoadError from '../../components/Generales/LoadError';
import PageContent from '../../components/Utiles/Page/PageContent';
import { Input, Option, Select } from '@material-tailwind/react';
import EmptyState from '../../components/Utiles/Page/EmptyState';
import FooterPagination from '../../components/Utiles/Pagination/FooterPagination';
import ProfessionalModal from '../../components/Utiles/Modals/Modal';
import ConfirmationModal from '../../components/Utiles/Modals/ConfirmationModal';
import { MdRestartAlt } from 'react-icons/md';
import TipoClaseList from '../../components/TipoClase/TipoClaseList';
import { useTipoClase } from '../../hooks/TipoClase/useTipoClase';
import FormSkeleton from '../../components/Utiles/Loader/FormSkeleton';
import TipoClaseForm from '../../components/TipoClase/TipoClaseForm';

type ModalTipoClaseType = {
    isOpen: boolean
    action: "none" | "add" | "update" | "delete" | "reactivate"
    tipoClase: null | TipoClaseItem | TipoClaseOutput
}

const TipoClasePages = () => {
    const [selectedTipoClaseId, setSelectedTipoClaseId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [status, setStatus] = useState<"ACTIVA" | "INACTIVA">("ACTIVA");
    const [search, setSearch] = useState("");

    // Hook para obtener la lista de tipos de clase
    const { data, error, isLoading, refetch } = useTiposClases(currentPage, pageSize, status, search);
    const tiposClase = data?.content ?? [];

    // Mutaciones para CRUD
    const { addTipoClase, updateTipoClase, deleteTipoClase, reactivateTipoClase, isDeleting, isReactivating, isAdding, isUpdating, controllerRef } = useTipoClaseMutations();

    // Hook para obtener un tipo clase especifico
    const { data: tipoClase, error: errorTipoClase, invalidateTipoClase, isLoading: isLoadingTipoClase } = useTipoClase(selectedTipoClaseId ?? 0)

    // Estado para manejar modal de agregar/editar
    const [modal, setModal] = useState<ModalTipoClaseType>({
        isOpen: false,
        action: "none",
        tipoClase: null
    });

    // Funcion qu se ejecuta al cerrar el modal
    const handleCloseModal = () => {
        setSelectedTipoClaseId(null)
        setModal({ isOpen: false, action: "none", tipoClase: null })
    }

    // Funcion que se ejecuta cuando se abre el modal de agregar
    const handleAddModalOpen = () => {
        setModal({
            isOpen: true,
            action: "add",
            tipoClase: null
        })
    }

    // Funcion que se ejecuta cuando se abre el modal de editat
    const handleEditModalOpen = (id: number) => {
        setModal({
            isOpen: true,
            action: "update",
            tipoClase: null
        })
        setSelectedTipoClaseId(id);
    }

    // Funcion que se ejecuta cuando se abre el modal para eliminar
    const handleDeleteModalOpen = (tipoClase: TipoClaseItem) => {
        setModal({
            isOpen: true,
            action: "delete",
            tipoClase
        });
    };

    // Funcion que se ejecuta cuando se abre el modal para reactivar
    const handleReactivateModalOpen = (tipoClase: TipoClaseItem) => {
        setModal({
            isOpen: true,
            action: "reactivate",
            tipoClase
        });
    }

    const handleAddTipoClase = async (data: TipoClaseInput) => {
        try {
            const response = await addTipoClase(data);
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateTipoClase();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al agregar el tipo de clase");
        }
    };

    const handleUpdateTipoClase = async (id: number, data: TipoClaseInput) => {
        try {
            const response = await updateTipoClase({ id, data });
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateTipoClase();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al actualizar el tipo de clase");
        }
    };

    const handledeleteTipoClase = async (id: number) => {
        try {
            const response = await deleteTipoClase(id);
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateTipoClase();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al eliminar el tipo de clase");
        }
    }

    const handleReactivateTipoClase = async (id: number) => {
        try {
            const response = await reactivateTipoClase(id);
            toast.success(response.mensaje);
            handleCloseModal();
            // invalidateTipoClase();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al reactivar el tipo de clase");
        }
    }

    // Estado que se ejecuta cuando se da click en editar
    useEffect(() => {
        if (tipoClase) {
            setModal({
                isOpen: true,
                action: "update",
                tipoClase: tipoClase
            });
        }
        if (errorTipoClase) {
            toast.error(getErrorMessage(errorTipoClase));
        }
    }, [tipoClase, errorTipoClase]);

    const firstLoadRef = useRef(true);

    useEffect(() => {
        if (data) {
            firstLoadRef.current = false;
        }
    }, [data]);

    const isFirstLoading = isLoading && firstLoadRef.current;

    if (isFirstLoading) {
        return (
            <Loader
                delay={0}
                message="Cargando los tipos de clase..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar los tipos de clase"
                mensaje={getErrorMessage(error) || "No se pudo obtener la lista de tipos de clase"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Gestión de Tipos de Clases"
                description="Administra los tipos de clases de tu sistema"
                action={
                    <NormalButton
                        type="button"
                        onClick={() => handleAddModalOpen()}
                        tooltip="Agregar Tipo Clase"
                    >
                        <FaPlus />
                        Agregar
                    </NormalButton>
                }
            />
            <PageContent>
                <div className=" space-y-3 md:flex md:justify-between md:space-y-0">
                    <div className="md:w-52">
                        <Select
                            label="Estatus"
                            value={status}
                            onChange={(val) => setStatus(val as "ACTIVA" | "INACTIVA")}
                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            <Option value="ACTIVA">ACTIVA</Option>
                            <Option value="INACTIVA">INACTIVA</Option>
                        </Select>
                    </div>
                    <div className="md:w-52">
                        <Input
                            label="Búsqueda"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(0);
                            }}
                            onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                        />
                    </div>
                </div>
                {tiposClase.length === 0 ? (
                    <EmptyState
                        type={search ? 'search' : 'empty'}
                        title={search ? 'No se encontraron tipos de clase' : `Sin tipos de clase ${status}`}
                        description={
                            search
                                ? `No encontramos resultados para "${search}". Prueba con otro término de búsqueda.`
                                : `No hay tipos de clase con estatus "${status}". Intenta con otra opción.`
                        }
                    />
                ) : (
                    <>
                        <TipoClaseList
                            tiposClases={tiposClase}
                            onUpdateTipoClase={id => handleEditModalOpen(id)}
                            onDeleteTipoClase={tipoClase => handleDeleteModalOpen(tipoClase)}
                            onReactivateTipoClase={tipoClase => handleReactivateModalOpen(tipoClase)}
                        />
                        <FooterPagination
                            currentPage={data?.number ?? 0}
                            totalPages={data?.totalPages ?? 0}
                            pageSize={pageSize}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(0);
                            }}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                )}
            </PageContent>

            {/* Modal para agregar */}
            <ProfessionalModal
                isOpen={modal.isOpen && (modal.action === "add" || modal.action === "update")}
                onClose={handleCloseModal}
                title={modal.tipoClase ? 'Editar Tipo Clase' : 'Agregar Tipo Clase'}
                size="2xl"
            >
                {isLoadingTipoClase ? (
                    <FormSkeleton delay={0} />
                ) : errorTipoClase ? (
                    <LoadError
                        titulo="Error al cargar el tipo de clase"
                        mensaje={getErrorMessage(error) || "No se pudo obtener la información del tipo de clase"}
                    />
                ) : (

                    <TipoClaseForm
                        initialData={tipoClase}
                        onSubmit={(data) => {
                            console.log(modal.tipoClase)
                            if (modal.action === "add") {
                                handleAddTipoClase(data);
                            } else if (modal.action === "update" && modal.tipoClase?.id) {
                                handleUpdateTipoClase(modal.tipoClase.id, data);
                            }
                        }}
                        onCancel={() => {
                            handleCloseModal();
                            controllerRef.current?.abort();
                        }}
                        isLoading={isAdding || isUpdating}
                        mode={modal.action as "add" | "update"}
                    />
                )}
            </ProfessionalModal>

            {/* Modal para reactivacion */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "reactivate"}
                onClose={() => {
                    handleCloseModal();
                    controllerRef.current?.abort();
                }}
                onConfirm={() => {
                    if (modal.tipoClase?.id) {
                        handleReactivateTipoClase(modal.tipoClase.id)
                    }
                }}
                title="Confirmar Reactivación"
                message={`¿Estás seguro de reactivar el tipo de clase "${modal.tipoClase?.nombre}"?`}
                confirmText="Reactivar"
                iconConfirm={<MdRestartAlt />}
                isLoading={isReactivating}
            />

            {/* Modal para eliminación */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "delete"}
                onClose={() => {
                    handleCloseModal()
                    controllerRef.current?.abort()
                }}
                onConfirm={() => {
                    if (modal.tipoClase?.id) {
                        handledeleteTipoClase(modal.tipoClase.id);
                    }
                }}
                title="Confirmar Desactivación"
                message={`¿Estás seguro de desactivar el usuario "${modal.tipoClase?.nombre}"?`}
                confirmText="Desactivar"
                iconConfirm={<FaTrash />}
                isLoading={isDeleting}
            />
        </>
    )
}

export default TipoClasePages
