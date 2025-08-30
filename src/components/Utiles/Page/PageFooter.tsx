import { motion } from "framer-motion";

type PageFooterProps = {
    franquicia: string
}

const PageFooter: React.FC<PageFooterProps> = ({
    franquicia
}) => {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border-t border-gray-200 px-3 py-2"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-2 md:mb-0">
                        <p className="text-sm text-gray-600">
                            © {currentYear} {franquicia}. Todos los derechos reservados.
                        </p>
                    </div>

                    {/* Opcional: Puedes agregar enlaces o íconos sociales aquí */}
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            <span className="sr-only">Facebook</span>
                            {/* Icono de Facebook o cualquier otra red social */}
                        </a>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default PageFooter;