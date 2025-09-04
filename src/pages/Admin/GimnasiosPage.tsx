import { FaPlus } from "react-icons/fa";
import LoadError from "../../components/Generales/LoadError";
import { NormalButton } from "../../components/Utiles/Buttons/NormalButton";
import Loader from "../../components/Utiles/Loader/Loader";
import PageHeader from "../../components/Utiles/Page/PageHeader";
import { getErrorMessage } from "../../helpers/errorHelper";
import PageContent from "../../components/Utiles/Page/PageContent";
import GimnasioList from "../../components/Gimnasio/GimnasioList";
import { useGimnasioMutations } from "../../hooks/Gimnasio/useGimnasioMutations";
import type { GimnasioInputType, GimnasioItem, GimnasioOutputType } from "../../interfaces/Gimnasio/Gimnasio";
import { useEffect, useRef, useState } from "react";
import ProfessionalModal from "../../components/Utiles/Modals/Modal";
import ConfirmationModal from "../../components/Utiles/Modals/ConfirmationModal";
import { MdDomainDisabled, MdRestartAlt } from "react-icons/md";
import toast from "react-hot-toast";
import GimnasioForm from "../../components/Gimnasio/GimnasioForm";
import { useGimnasio } from "../../hooks/Gimnasio/useGimnasio";
import EmptyState from "../../components/Utiles/Page/EmptyState";
import { Input, Option, Select } from "@material-tailwind/react";
import FooterPagination from "../../components/Utiles/Pagination/FooterPagination";
import { useGimnasios } from "../../hooks/Gimnasio/useGimnasios";

type ModalType = {
    isOpen: boolean
    action: "none" | "add" | "update" | "delete" | "reactivate"
    gimnasio: null | GimnasioItem | GimnasioOutputType
}

const GimnasiosPage = () => {
    const [selectedGimnasioId, setSelectedGimnasioId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [status, setStatus] = useState<"ACTIVO" | "INACTIVO">("ACTIVO");
    const [search, setSearch] = useState("");

    // Hook para obtener todos los gimnasios
    const {
        data,
        error,
        isLoading,
        refetch
    } = useGimnasios(currentPage, pageSize, status, search);

    // Mutaciones para CRUD
    const { addGimnasio, updateGimnasio, deleteGimnasio, reactivateGimnasio, isAdding, isUpdating, isReactivating, isDeleting, controllerRef } = useGimnasioMutations();
    const gimnasios = data?.content ?? [];

    // Hook para obtener un gimnasio
    const { data: gimnasio, error: errorGimnasio, invalidateGimnasio } = useGimnasio(selectedGimnasioId ?? 0);

    // Estado para manejar modal de agregar/editar
    const [modal, setModal] = useState<ModalType>({
        isOpen: false,
        action: "none",
        gimnasio: null
    });

    // Funcion qu se ejecuta al cerrar el modal
    const handleCloseModal = () => {
        setSelectedGimnasioId(null)
        setModal({ isOpen: false, action: "none", gimnasio: null })
    }

    // Funcion que se ejecuta cuando se abre el modal de agregar
    const handleAddModalOpen = () => {
        setModal({
            isOpen: true,
            action: "add",
            gimnasio: null
        })
    }

    // Funcion que se ejecuta cuando se abre el modal de editat
    const handleEditModalOpen = (id: number) => {
        setSelectedGimnasioId(id);
    }

    // Funcion que se ejecuta cuando se abre el modal para eliminar
    const handleDeleteModalOpen = (gimnasio: GimnasioItem) => {
        setModal({
            isOpen: true,
            action: "delete",
            gimnasio
        });
    };

    // Funcion que se ejecuta cuando se abre el modal para reactivar
    const handleReactivateModalOpen = (gimnasio: GimnasioItem) => {
        setModal({
            isOpen: true,
            action: "reactivate",
            gimnasio
        });
    }

    const handleAddGimnasio = async (data: GimnasioInputType) => {
        try {
            const response = await addGimnasio(data);
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateGimnasio();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al agregar el gimnasio");
        }
    };

    const handleUpdateGimnasio = async (id: number, data: GimnasioInputType) => {
        try {
            const response = await updateGimnasio({ id, data });
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateGimnasio();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al agregar el gimnasio");
        }
    };

    const handledeleteGimnasio = async (id: number) => {
        try {
            const response = await deleteGimnasio(id);
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateGimnasio();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al eliminar el gimnasio");
        }
    }

    const handleReactivateGimnasio = async (id: number) => {
        try {
            const response = await reactivateGimnasio(id);
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateGimnasio();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al reactivar el gimnasio");
        }
    }

    // Estado que se ejecuta cuando se da click en editar
    useEffect(() => {
        if (gimnasio) {
            setModal({
                isOpen: true,
                action: "update",
                gimnasio: gimnasio
            });
        }
        if (errorGimnasio) {
            toast.error(getErrorMessage(errorGimnasio));
        }
    }, [gimnasio, errorGimnasio]);

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
                message="Cargando los gimnasios..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar los gimnasios"
                mensaje={getErrorMessage(error) || "No se pudo obtener la lista de gimnasios"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Gestión de Gimnasios"
                description="Administra los gimnasios de tu red"
                action={
                    <NormalButton
                        type="button"
                        onClick={handleAddModalOpen}
                        tooltip="Agregar Gimnasio"
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
                            onChange={(val) => setStatus(val as "ACTIVO" | "INACTIVO")}
                            placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                        >
                            <Option value="ACTIVO">ACTIVO</Option>
                            <Option value="INACTIVO">INACTIVO</Option>
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
                {gimnasios.length === 0 ? (
                    <EmptyState
                        type={search ? 'search' : 'empty'}
                        title={search ? 'No se encontraron gimnasios' : `Sin gimnasios ${status}`}
                        description={
                            search
                                ? `No encontramos resultados para "${search}". Prueba con otro término de búsqueda.`
                                : `No hay gimnasios con estatus "${status}". Intenta con otra opción.`
                        }
                    />

                ) : (
                    <>
                        < GimnasioList
                            gimnasios={gimnasios}
                            onUpdateGimnasio={id => handleEditModalOpen(id)}
                            onDeleteGimnasio={gimnasio => handleDeleteModalOpen(gimnasio)}
                            onReactivateGimnasio={gimnasio => handleReactivateModalOpen(gimnasio)}
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

            <ProfessionalModal
                isOpen={modal.isOpen && modal.action !== "reactivate" && modal.action !== "delete"}
                onClose={handleCloseModal}
                title={modal.gimnasio ? 'Editar Gimnasio' : 'Agregar Gimnasio'}
                size="2xl"
            >
                <GimnasioForm
                    initialData={modal.gimnasio as GimnasioOutputType}
                    onSubmit={(data) => {
                        if (modal.action === "add") {
                            handleAddGimnasio(data);
                        } else if (modal.action === "update" && modal.gimnasio?.id) {
                            handleUpdateGimnasio(modal.gimnasio.id, data);
                        }
                    }}
                    onCancel={() => {
                        handleCloseModal();
                        controllerRef.current?.abort();
                    }}
                    isLoading={isAdding || isUpdating}
                />

            </ProfessionalModal>

            {/* Modal para reactivacion */}
            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "reactivate"}
                onClose={() => {
                    handleCloseModal();
                    controllerRef.current?.abort();
                }}
                onConfirm={() => {
                    if (modal.gimnasio?.id) {
                        handleReactivateGimnasio(modal.gimnasio.id)
                    }
                }}
                title="Confirmar Reactivación"
                message={`¿Estás seguro de reactivar el gimnasio "${modal.gimnasio?.nombre}"?`}
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
                    if (modal.gimnasio?.id) {
                        handledeleteGimnasio(modal.gimnasio.id);
                    }
                }}
                title="Confirmar Desactivación"
                message={`¿Estás seguro de desactivar el gimnasio "${modal.gimnasio?.nombre}"?`}
                confirmText="Desactivar"
                iconConfirm={<MdDomainDisabled />}
                isLoading={isDeleting}
            />
        </>
    )
}

export default GimnasiosPage