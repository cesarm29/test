import React, { useState } from "react";
import { Button, Form, Table, Col, Row, Spinner } from "react-bootstrap";
import { getProductos, getIvas, registrarAlbaran } from "../services/api";
import { Item } from "../interfaces/Item";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import { useTranslation } from "react-i18next";

interface FormularioAlbaranProps {
  token: string | null;
}

const FormularioAlbaran: React.FC<FormularioAlbaranProps> = ({ token }) => {
  const [productos, setProductos] = useState<any[]>([]);
  const [ivas, setIvas] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([
    {
      id: 0,
      descripcion: "",
      cantidad: 1,
      precio: 0,
      descuento: 0,
      iva: 0,
      ivaventa_id: 0,
      recargo_equivalencia: 0,
      subtotal: 0,
      base_imponible: 0,
      importe_iva: 0,
      importe_recargo: 0,
      total: 0,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (token && !hasFetchedData) {
      try {
        setHasFetchedData(true);

        const productosData = await getProductos(token, 1);
        const ivasData = await getIvas(token);

        if (productosData && productosData.datos && productosData.datos.data) {
          setProductos(productosData.datos.data);
        }

        if (ivasData && ivasData.datos) {
          const sortedIvas = ivasData.datos.sort(
            (a: any, b: any) => a.tipo - b.tipo
          );
          setIvas(sortedIvas);
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Error al obtener productos e IVAs:", error);

        if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: t("No autorizado"),
            text: t("Tu sesión ha expirado. Por favor, inicia sesión nuevamente."),
          }).then(() => {
            navigate("/");
          });
        } else {
          setLoading(false);
        }
      }
    }
  };

  if (!hasFetchedData) {
    fetchData();
  }

  const handleChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const item = newItems[index];

    const descuentoAplicado = item.descuento > 0 ? item.descuento / 100 : 0;
    item.subtotal = item.cantidad * item.precio;
    item.base_imponible = item.subtotal - item.subtotal * descuentoAplicado;
    item.importe_iva = item.base_imponible * (item.iva / 100);
    item.importe_recargo = item.recargo_equivalencia
      ? item.base_imponible * item.recargo_equivalencia
      : 0;

    item.total = item.base_imponible + item.importe_iva + item.importe_recargo;

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: 0,
        descripcion: "",
        cantidad: 1,
        precio: 0,
        descuento: 0,
        iva: 0,
        ivaventa_id: 0,
        recargo_equivalencia: 0,
        subtotal: 0,
        base_imponible: 0,
        importe_iva: 0,
        importe_recargo: 0,
        total: 0,
      },
    ]);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, idx) => idx !== index);
    setItems(newItems);
  };

  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    try {
      if (
        items.some(
          (item) => !item.descripcion || item.precio <= 0 || item.cantidad <= 0
        )
      ) {
        Swal.fire({
          icon: "error",
          title: t("Error"),
          text: t("Todos los campos deben ser válidos"),
        });
        return;
      }

      const albaranData = {
        almacen_id: 13,
        centro_origen_id: 70,
        centro_id: 71,
        fecha: getLocalDate(),
        items_albaranesventas: items.map((item) => ({
          descuento: item.descuento,
          iva: item.iva,
          cantidad: item.cantidad,
          ivaventa_id: item.ivaventa_id,
          descripcion: item.descripcion,
          precio: item.precio,
          recargo_equivalencia: item.recargo_equivalencia > 0 ? 0.08 : 0,
        })),
      };

      const response = await registrarAlbaran(albaranData, token!);
      console.log(response);
      if (response.codigo === 201) {
        const albaran = response.datos;
        Swal.fire({
          icon: "success",
          title: t("Albarán registrado"),
          text: `${t("Albarán registrado con el número")} ${albaran.id}.`,
          footer: `${t("Fecha")}: ${albaran.fecha} - ${t("Cliente")}: ${albaran.cliente.nombre}`,
        }).then(() => {
          setItems([
            {
              id: 0,
              descripcion: "",
              cantidad: 1,
              precio: 0,
              descuento: 0,
              iva: 0,
              ivaventa_id: 0,
              recargo_equivalencia: 0,
              subtotal: 0,
              base_imponible: 0,
              importe_iva: 0,
              importe_recargo: 0,
              total: 0,
            },
          ]);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("Error"),
          text: t("Hubo un error al registrar el albarán"),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("Error"),
        text: t("Hubo un error al registrar el albarán"),
      });
    }
  };

  return (
    <div className="m-5">
      <h1 className="text-center mb-4">{t("Formulario de Albarán")}</h1>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="centroOrigen">
              <Form.Label>{t("Centro Origen")}</Form.Label>
              <Form.Control as="select">
                <option>{t("Centro Origen 1")}</option>
                <option>{t("Centro Origen 2")}</option>
                <option>{t("Centro Origen 3")}</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="centroDestino">
              <Form.Label>{t("Centro Destino")}</Form.Label>
              <Form.Control as="select">
                <option>{t("Centro Destino 1")}</option>
                <option>{t("Centro Destino 2")}</option>
                <option>{t("Centro Destino 3")}</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="almacen">
              <Form.Label>{t("Almacén")}</Form.Label>
              <Form.Control as="select">
                <option>{t("Almacén 1")}</option>
                <option>{t("Almacén 2")}</option>
                <option>{t("Almacén 3")}</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="fecha">
              <Form.Label>{t("Fecha")}</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>
        </Row>

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center mb-4"
            style={{ height: "50px" }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="text-center align-middle">{t("Descripción")}</th>
                <th className="text-center align-middle">{t("Cantidad")}</th>
                <th className="text-center align-middle">{t("Precio")}</th>
                <th className="text-center align-middle">{t("% Descuento")}</th>
                <th className="text-center align-middle">{t("Subtotal")}</th>
                <th className="text-center align-middle">{t("Base Imponible")}</th>
                <th className="text-center align-middle">{t("% IVA")}</th>
                <th className="text-center align-middle">{t("Importe IVA")}</th>
                <th className="text-center align-middle">{t("Recargo")}</th>
                <th className="text-center align-middle">{t("Importe Recargo")}</th>
                <th className="text-center align-middle">{t("Total")}</th>
                <th className="text-center align-middle">{t("Acciones")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="text-center align-middle">
                    <div style={{ position: "relative", zIndex: 999 }}>
                      <Creatable
                        value={
                          item.descripcion
                            ? {
                                label: item.descripcion,
                                value: item.descripcion,
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const newDescripcion = selectedOption
                            ? selectedOption.value
                            : "";
                          handleChange(index, "descripcion", newDescripcion);
                        }}
                        onCreateOption={(inputValue) => {
                          const newDescripcion = inputValue.trim();
                          handleChange(index, "descripcion", newDescripcion);
                        }}
                        options={productos.map((producto) => ({
                          label: producto.nombre,
                          value: producto.nombre,
                        }))}
                        isClearable
                        isSearchable
                        placeholder={t("Buscar o escribir descripción")}
                        menuPortalTarget={document.body}
                      />
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <Form.Control
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "cantidad",
                          parseFloat(e.target.value)
                        )
                      }
                      min={0.01}
                      step={0.01}
                    />
                  </td>
                  <td className="text-center align-middle">
                    <Form.Control
                      type="number"
                      value={item.precio}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "precio",
                          parseFloat(e.target.value)
                        )
                      }
                      min={0.01}
                      step={0.01}
                    />
                  </td>
                  <td className="text-center align-middle">
                    <Form.Control
                      type="number"
                      value={item.descuento}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "descuento",
                          parseFloat(e.target.value)
                        )
                      }
                      min={0}
                      max={99.9}
                      step={0.1}
                    />
                  </td>
                  <td className="text-center align-middle">
                    {item.subtotal.toFixed(2)}
                  </td>
                  <td className="text-center align-middle">
                    {item.base_imponible.toFixed(2)}
                  </td>
                  <td className="text-center align-middle">
                    <Form.Control
                      as="select"
                      value={item.ivaventa_id}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "ivaventa_id",
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {ivas.map((iva) => (
                        <option key={iva.id} value={iva.id}>
                          {iva.tipo * 100} %
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td className="text-center align-middle">
                    {item.importe_iva.toFixed(2)}
                  </td>
                  <td className="text-center align-middle">
                    <Form.Check
                      type="checkbox"
                      checked={item.recargo_equivalencia > 0}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "recargo_equivalencia",
                          e.target.checked ? 0.08 : 0
                        )
                      }
                    />
                  </td>
                  <td className="text-center align-middle">
                    {item.importe_recargo.toFixed(2)}
                  </td>
                  <td className="text-center align-middle">
                    {item.total.toFixed(2)}
                  </td>
                  <td className="text-center align-middle">
                    <Button
                      variant="danger"
                      onClick={() => deleteItem(index)}
                      title={t("Eliminar ítem")}
                    >
                      <div>
                        <FaTrash />
                      </div>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Button variant="primary" onClick={addItem} className="mb-3">
          {t("Agregar ítem")}
        </Button>
      </Form>

      <div className="mt-4 d-flex justify-content-end">
        <div className="mr-3">
          <h3 className="px-5">
            {t("Total del albarán")}:{" "}
            {items.reduce((acc, item) => acc + item.total, 0).toFixed(2)}
          </h3>
        </div>
        <Button variant="success" onClick={handleSubmit}>
          {t("Guardar Albarán")}
        </Button>
      </div>
    </div>
  );
};

export default FormularioAlbaran;
