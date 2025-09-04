import { FaPlus } from "react-icons/fa"
import { NormalButton } from "../../components/Utiles/Buttons/NormalButton"
import PageHeader from "../../components/Utiles/Page/PageHeader"
import { useNivelesAcceso } from "../../hooks/NivelAcceso/useNivelesAcceso"
import { useEffect, useRef, useState } from "react"
import Loader from "../../components/Utiles/Loader/Loader"
import LoadError from "../../components/Generales/LoadError"
import { getErrorMessage } from "../../helpers/errorHelper"
import PageContent from "../../components/Utiles/Page/PageContent"
import EmptyState from "../../components/Utiles/Page/EmptyState"
import FooterPagination from "../../components/Utiles/Pagination/FooterPagination"
import NivelAccesoList from "../../components/NivelAcceso/NivelAccesoList";
import type { NivelAccesoInputType, NivelAccesoItem, NivelAccesoOutput } from "../../interfaces/NivelAcceso/NivelAcceso"
import ProfessionalModal from "../../components/Utiles/Modals/Modal"
import NivelAccesoForm from "../../components/NivelAcceso/NivelAccesoForm"
import { useNivelAcceso } from "../../hooks/NivelAcceso/useNivelAcceso"
import toast from "react-hot-toast"
import { useNivelAccesoMutations } from "../../hooks/NivelAcceso/useNivelAccesoMutations"
import ConfirmationModal from "../../components/Utiles/Modals/ConfirmationModal"
import { MdDomainDisabled, MdRestartAlt } from "react-icons/md"
import { Input, Option, Select } from "@material-tailwind/react"

type ModalNivelAccesoType = {
    isOpen: boolean
    action: "none" | "add" | "update" | "delete" | "reactivate"
    nivelAcceso: null | NivelAccesoItem | NivelAccesoOutput
}

const NivelAccesoPage = () => {
    const [selectedNivelId, setSelectedNivelId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const [status, setStatus] = useState<"ACTIVO" | "INACTIVO">("ACTIVO");
    const [search, setSearch] = useState("");

    // Hook par obtener todos los niveles de acceso
    const { data, error, isLoading, refetch } = useNivelesAcceso(currentPage, pageSize, status, search);
    const nivelesAcceso = data?.content ?? [];

    // Mutaciones para CRUD
    const { addNivelAcceso, updateNivelAcceso, deleteNivelAcceso, reactivateNivelAcceso, isAdding, isUpdating, isDeleting, isReactivating, controllerRef } = useNivelAccesoMutations();

    // Hook para obtener un nivel de acceso especifico
    const { data: nivel, error: errorNivel, invalidateNivelAcceso } = useNivelAcceso(selectedNivelId ?? 0);

    // Estado para manejar modal de agregar/editar
    const [modal, setModal] = useState<ModalNivelAccesoType>({
        isOpen: false,
        action: "none",
        nivelAcceso: null
    });

    // Funcion que se ejecuta al cerrar los modales
    const handleCloseModal = () => {
        setSelectedNivelId(null);
        setModal({
            isOpen: false,
            action: "none",
            nivelAcceso: null
        });
    }

    // Funcion que se ejecuta el abrir el modal para agregar
    const handleModalAddOpen = () => {
        setModal({
            isOpen: true,
            action: "add",
            nivelAcceso: null
        });
    }

    // Funcion que se ejecuta al abrir el modal para editar
    const handleModalEditOpen = (id: number) => {
        setSelectedNivelId(id);
    }

    // Funcion que se ejecuta al abrir el modal para eliminar
    const handleModalDeleteOpen = (nivel: NivelAccesoItem) => {
        setModal({
            isOpen: true,
            action: "delete",
            nivelAcceso: nivel
        });
    }

    // Funcion que se ejecuta al abrir el modal para reactivar
    const handleModalReactivateOpen = (nivel: NivelAccesoItem) => {
        setModal({
            isOpen: true,
            action: "reactivate",
            nivelAcceso: nivel
        });
    }

    const handleAddNivelAcceso = async (data: NivelAccesoInputType) => {
        try {
            const response = await addNivelAcceso(data);
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateNivelAcceso();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al agregar el gimnasio");
        }
    };

    const handleUpdateNivelAcceso = async (id: number, data: NivelAccesoInputType) => {
        try {
            const response = await updateNivelAcceso({ id, data });
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateNivelAcceso();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al agregar el nivel de acceso");
        }
    };

    const handledeleteNivelAcceso = async (id: number) => {
        try {
            const response = await deleteNivelAcceso(id);
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateNivelAcceso();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al eliminar el nivel de acceso");
        }
    }

    const handleReactivateNivelAcceso = async (id: number) => {
        try {
            const response = await reactivateNivelAcceso(id);
            toast.success(response.mensaje);
            handleCloseModal();
            invalidateNivelAcceso();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Ocurrió un error al reactivar el nivel de acceso");
        }
    }

    // Estado que se ejecuta al dar click en editar
    useEffect(() => {
        if (nivel) {
            setModal({
                isOpen: true,
                action: "update",
                nivelAcceso: nivel
            });
        }
        if (errorNivel) {
            toast.error(getErrorMessage(errorNivel));
        }
    }, [nivel, errorNivel]);

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
                message="Cargando los niveles de acceso..."
            />
        );
    }

    if (error) {
        return (
            <LoadError
                titulo="Error al cargar los niveles de acceso"
                mensaje={getErrorMessage(error) || "No se pudo obtener la lista de niveles de acceso"}
                textoBoton='Reintentar'
                onReintentar={() => { refetch() }}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Gestión de Niveles de Acceso"
                description="Administra los niveles de acceso de tu sistema"
                action={
                    <NormalButton
                        type="button"
                        onClick={handleModalAddOpen}
                        tooltip="Agregar Nivel"
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
                {nivelesAcceso.length === 0 ? (
                    <EmptyState
                        type={search ? 'search' : 'empty'}
                        title={search ? 'No se encontraron niveles de acceso' : `Sin niveles ${status}`}
                        description={
                            search
                                ? `No encontramos resultados para "${search}". Prueba con otro término de búsqueda.`
                                : `No hay niveles con estatus "${status}". Intenta con otra opción.`
                        }
                    />
                ) : (
                    <>
                        <NivelAccesoList
                            nivelesAcceso={nivelesAcceso}
                            onUpdateNivelAcceso={id => handleModalEditOpen(id)}
                            onDeleteNivelAcceso={nivel => handleModalDeleteOpen(nivel)}
                            onReactivateNivelAcceso={nivel => handleModalReactivateOpen(nivel)}
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
                title={modal.nivelAcceso ? 'Editar Nivel' : 'Agregar Nivel'}
                size="2xl"
            >
                <NivelAccesoForm
                    initialData={modal.nivelAcceso as NivelAccesoOutput}
                    onSubmit={(data) => {
                        if (modal.action === "add") {
                            handleAddNivelAcceso(data);
                        } else if (modal.action === "update" && modal.nivelAcceso?.id) {
                            handleUpdateNivelAcceso(modal.nivelAcceso.id, data);
                        }
                    }}
                    onCancel={() => {
                        handleCloseModal();
                        controllerRef.current?.abort();
                    }}
                    isLoading={isAdding || isUpdating}
                />
            </ProfessionalModal>

            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "reactivate"}
                onClose={() => {
                    handleCloseModal();
                    controllerRef.current?.abort();
                }}
                onConfirm={() => {
                    if (modal.nivelAcceso?.id) {
                        handleReactivateNivelAcceso(modal.nivelAcceso.id)
                    }
                }}
                title="Confirmar Reactivación"
                message={`¿Estás seguro de reactivar el nivel "${modal.nivelAcceso?.nombre}"?`}
                confirmText="Reactivar"
                iconConfirm={<MdRestartAlt />}
                isLoading={isReactivating}
            />

            <ConfirmationModal
                isOpen={modal.isOpen && modal.action === "delete"}
                onClose={() => {
                    handleCloseModal();
                    controllerRef.current?.abort();
                }}
                onConfirm={() => {
                    if (modal.nivelAcceso?.id) {
                        handledeleteNivelAcceso(modal.nivelAcceso.id)
                    }
                }}
                title="Confirmar Desactivación"
                message={`¿Estás seguro de desactivar el nivel "${modal.nivelAcceso?.nombre}"?`}
                confirmText="Desactivar"
                iconConfirm={<MdDomainDisabled />}
                isLoading={isDeleting}
            />
        </>
    )
}

export default NivelAccesoPage