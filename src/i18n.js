import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Formulario de Albarán": "Invoice Form",
      "Centro Origen": "Source Center",
      "Centro Destino": "Destination Center",
      "Almacén": "Warehouse",
      "Fecha": "Date",
      "Descripción": "Description",
      "Cantidad": "Quantity",
      "Precio": "Price",
      "Total": "Total",
      "Guardar Albarán": "Save Invoice",
      "Agregar ítem": "Add Item",
      "Eliminar ítem": "Delete Item",
      "Error": "Error",
      "No autorizado": "Unauthorized",
      "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.": "Your session has expired. Please log in again.",
      "Iniciar sesión": "Login",
      "Correo electrónico": "Email",
      "Contraseña": "Password",
      "Error de inicio de sesión, verifica tus credenciales": "Login error, check your credentials"
    },
  },
  es: {
    translation: {
      "Formulario de Albarán": "Formulario de Albarán",
      "Centro Origen": "Centro Origen",
      "Centro Destino": "Centro Destino",
      "Almacén": "Almacén",
      "Fecha": "Fecha",
      "Descripción": "Descripción",
      "Cantidad": "Cantidad",
      "Precio": "Precio",
      "Total": "Total",
      "Guardar Albarán": "Guardar Albarán",
      "Agregar ítem": "Agregar ítem",
      "Eliminar ítem": "Eliminar ítem",
      "Error": "Error",
      "No autorizado": "No autorizado",
      "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      "Iniciar sesión": "Iniciar sesión",
      "Correo electrónico": "Correo electrónico",
      "Contraseña": "Contraseña",
      "Error de inicio de sesión, verifica tus credenciales": "Error de inicio de sesión, verifica tus credenciales"
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
