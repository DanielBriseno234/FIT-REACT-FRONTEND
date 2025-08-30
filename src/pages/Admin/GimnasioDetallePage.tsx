import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useGimnasio } from '../../hooks/useGimnasio';
import Loader from '../../components/Utiles/Loader/Loader';
import LoadError from '../../components/Generales/LoadError';
import { getErrorMessage } from '../../helpers/errorHelper';
import PageHeader from '../../components/Utiles/Page/PageHeader';
import { NormalButton } from '../../components/Utiles/Buttons/NormalButton';
import { FaArrowLeft } from 'react-icons/fa';
import PageContent from '../../components/Utiles/Page/PageContent';
import Badge from '../../components/Generales/Badge';
import { FiClock, FiGlobe, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { formatearAbreviacionDia, formatearHora } from '../../helpers/formatHelpers';
import EmptyState from '../../components/Utiles/Page/EmptyState';
import { useEffect, useRef } from 'react';

const GimnasioDetallePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: gimnasio, error, isLoading, refetch } = useGimnasio(Number(id));

  const firstLoadRef = useRef(true);

  const isFirstLoading = isLoading && firstLoadRef.current;

  useEffect(() => {
    if (gimnasio) {
      firstLoadRef.current = false;
    }
  }, [gimnasio]);

  if (isFirstLoading) {
    return (
      <Loader
        delay={0}
        message="Cargando los detalles del gimnasio..."
      />
    );
  }

  if (error) {
    return (
      <LoadError
        titulo="Error al cargar detalles"
        mensaje={getErrorMessage(error) || "No se pudo obtener la información"}
        textoBoton='Reintentar'
        onReintentar={() => { refetch() }}
      />
    );
  }

  if (!gimnasio) {
    return (
      <EmptyState
        type={'empty'}
        title={'No se encontró el gimnasio'}
        description={'Al parecer no encontramos el gimnasio que estabas buscando'}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={gimnasio.nombre || "Detalles del Gimnasio"}
        description="Información detallada sobre las instalaciones y servicios"
        action={

          <NormalButton
            type="button"
            onClick={() => navigate(-1)}
            tooltip='Regresar a la pág anterior'
            className="hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft />
            Volver
          </NormalButton>

        }
      />

      <PageContent>
        {/* Tarjeta principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Imagen */}
            <div className="lg:w-2/5 xl:w-1/3 relative">
              <img
                src={gimnasio.logoUrl || '/images/gym-default.jpg'}
                alt={`Logo de ${gimnasio.nombre}`}
                className="w-full h-64 lg:h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge
                  variant={gimnasio.activo ? 'success' : 'danger'}
                  className={`backdrop-blur-sm ${gimnasio.activo == 'ACTIVO' ? 'bg-green-600/60' : "bg-red-600/50"}`}
                >
                  {gimnasio.activo == 'ACTIVO' ? <span className={`text-green-200`}>Activo</span> : <span className={`text-red-200`}>Inactivo</span>}
                </Badge>
              </div>
            </div>

            {/* Información */}
            <div className="lg:w-3/5 xl:w-2/3 p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{gimnasio.nombre}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {/* Dirección */}
                {gimnasio.direccion && (
                  <div className="flex items-start">
                    <FiMapPin className="text-[var(--color-primary)] mt-1 mr-3 flex-shrink-0 lg:text-lg" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Dirección</h3>
                      <p className="text-gray-800 lg:text-lg">{gimnasio.direccion}</p>
                    </div>
                  </div>
                )}

                {/* Teléfono */}
                {gimnasio.telefono && (
                  <div className="flex items-start">
                    <FiPhone className="text-[var(--color-primary)] mt-1 mr-3 flex-shrink-0 lg:text-lg" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Teléfono</h3>
                      <p className="text-gray-800 lg:text-lg">
                        <a href={`tel:${gimnasio.telefono}`} className="hover:text-[var(--color-primary)] transition-colors">
                          {gimnasio.telefono}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {gimnasio.email && (
                  <div className="flex items-start">
                    <FiMail className="text-[var(--color-primary)] mt-1 mr-3 flex-shrink-0 lg:text-lg" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</h3>
                      <p className="text-gray-800 lg:text-lg">
                        <a href={`mailto:${gimnasio.email}`} className="hover:text-[var(--color-primary)] transition-colors break-all">
                          {gimnasio.email}
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Sitio web */}
                {gimnasio.sitioWeb && (
                  <div className="flex items-start">
                    <FiGlobe className="text-[var(--color-primary)] mt-1 mr-3 flex-shrink-0 lg:text-lg" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Sitio web</h3>
                      <p className="text-gray-800 lg:text-lg">
                        <a
                          href={gimnasio.sitioWeb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--color-primary)] transition-colors break-all"
                        >
                          {gimnasio.sitioWeb.replace(/^https?:\/\//, '')}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Horarios - Versión mejorada para desktop */}
        {gimnasio.horarios && gimnasio.horarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          >
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <FiClock className="text-[var(--color-primary)] mr-3 lg:text-xl" />
              Horarios de atención
            </h3>

            {/* Versión mobile */}
            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map(dayNumber => {
                const schedule = gimnasio.horarios.find(h => h.diaSemana === dayNumber);
                const isOpen = schedule && schedule.horaApertura && schedule.horaCierre;

                return (
                  <div key={dayNumber} className={`rounded-lg p-3 ${isOpen ? 'bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/20' : 'bg-gray-50'}`}>
                    <h4 className="font-medium text-gray-800 text-sm mb-1">
                      {formatearAbreviacionDia(dayNumber)}
                    </h4>
                    {isOpen ? (
                      <p className="text-xs text-gray-600">
                        {formatearHora(schedule.horaApertura)} - {formatearHora(schedule.horaCierre)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Cerrado</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Versión desktop */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {[1, 2, 3, 4, 5, 6, 7].map(dayNumber => (
                        <th
                          key={dayNumber}
                          className="pb-3 px-2 text-center font-medium text-gray-700"
                        >
                          {formatearAbreviacionDia(dayNumber)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {[1, 2, 3, 4, 5, 6, 7].map(dayNumber => {
                        const schedule = gimnasio.horarios.find(h => h.diaSemana === dayNumber);
                        const isOpen = schedule && schedule.horaApertura && schedule.horaCierre;

                        return (
                          <td
                            key={dayNumber}
                            className={`py-4 px-2 text-center ${isOpen ? 'bg-[var(--color-primary)]/15' : 'bg-gray-50'}`}
                          >
                            {isOpen ? (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {formatearHora(schedule.horaApertura)}
                                </p>
                                <span className="text-xs text-gray-500">a</span>
                                <p className="text-sm font-medium text-gray-800">
                                  {formatearHora(schedule.horaCierre)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400">Cerrado</p>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Zonas - Versión mejorada para desktop */}
        {gimnasio.zonas && gimnasio.zonas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          >
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">Zonas del gimnasio</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              {gimnasio.zonas.map(({ nombre, descripcion }, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-5 hover:border-[var(--color-primary)]/15 transition-colors hover:shadow-sm"
                >
                  <div className="flex items-start mb-3">
                    <div className="bg-[var(--color-primary)]/15 text-[var(--color-primary)] rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-semibold">{idx + 1}</span>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-800 pt-1">{nombre}</h4>
                  </div>

                  {descripcion && (
                    <p className="text-gray-600 mb-4 lg:min-h-[60px]">{descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Políticas y términos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {gimnasio.politica?.contenido && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8"
            >
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6">Políticas</h3>
              <div className="prose prose-sm lg:prose-base text-gray-600 max-w-none">
                {gimnasio.politica.contenido.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </motion.div>
          )}

          {gimnasio.terminos?.contenido && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8"
            >
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6">Términos y condiciones</h3>
              <div className="prose prose-sm lg:prose-base text-gray-600 max-w-none">
                {gimnasio.terminos.contenido.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </PageContent>
    </>
  );
}

export default GimnasioDetallePage


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useGymStore } from "../../store/gymStore";
// import Loader from "../../components/Utiles/Loader/Loader";
// import GimnasioDetails from "../../components/Gimnasio/GimnasioDetails";
// import NormalButton from "../../components/Utiles/Botones/NormalButton";
// import { FaArrowLeft } from "react-icons/fa";
// import LoadError from "../../components/Generales/ErrorCarga";

// const GimnasioDetallePage = () => {
//   const { id } = useParams();

//   const { obtenerGimnasioEspecifico } = useGymStore();

//   const [gimnasio, setGimnasio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchGimnasio = async () => {
//     setLoading(true);
//     const result = await obtenerGimnasioEspecifico(id);
//     if (result.success) {
//       setGimnasio(result.datos);
//       setError(null);
//     } else {
//       setError(result.mensaje || "Error al cargar el gimnasio");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchGimnasio();
//   }, [id, obtenerGimnasioEspecifico]);

//   if (loading) return <Loader message="Cargando detalles del gimnasio..." />

//   if (error) return (
//     <LoadError
//       titulo="Error al cargar la información del gimnasio"
//       mensaje={error || "Ocurrió un error inesperado"}
//       textoBoton='Reintentar'
//       onReintentar={() => { fetchGimnasio() }}
//     />
//   );

//   return (
//     <div>
//       <GimnasioDetails gimnasio={gimnasio} />
//     </div>
//   );
// };

// export default GimnasioDetallePage;
