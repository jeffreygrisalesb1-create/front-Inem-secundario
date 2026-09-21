const CRUD_CONFIG = {
  "form-categorias.html": { api: "categorias", id: "Categoria_id", fields: ["nombre"] },
  "form-ciudades.html": { api: "ciudades", id: "Ciudad_id", fields: ["nombre", "Pais_id"], aliases: { Pais_id: "pais_id" }, relations: [{ field: "Pais_id", api: "paises", value: "Pais_id" }] },
  "form-clientes.html": { api: "clientes", id: "Cliente_id", fields: ["nombre", "correo", "telefono", "dni"], display: ["nombre", "correo", "telefono", "dni"] },
  "form-compras.html": { api: "compras", id: "Compra_id", fields: ["fecha", "Cliente_id", "Empleado_id"], display: ["fecha", "Cliente_id", "Empleado_id"], aliases: { Cliente_id: "cliente_id", Empleado_id: "empleado_id" }, relations: [{ field: "Cliente_id", label: "Cliente", api: "clientes", value: "Cliente_id" }, { field: "Empleado_id", label: "Empleado", api: "empleados", value: "Empleado_id" }, { field: "producto_id", label: "Producto", api: "productos", value: "Producto_id", uiOnly: true }, { field: "vehiculo_id", label: "Vehículo", api: "vehiculos", fallbackApi: "Vehiculos", value: "Vehiculo_id", uiOnly: true }] },
  "form-cp.html": { api: "cp", id: "Cp_id", fields: ["Compra_id", "Producto_id"], relations: [{ field: "Compra_id", api: "compras", value: "Compra_id" }, { field: "Producto_id", api: "productos", value: "Producto_id" }] },
  "form-cv.html": { api: "cv", id: "Cv_id", fields: ["Compra_id", "Vehiculo_id"], display: ["Compra_id", "Vehiculo_id"], relations: [{ field: "Compra_id", label: "Compra", api: "compras", value: "Compra_id" }, { field: "Vehiculo_id", label: "Vehículo", api: "vehiculos", value: "Vehiculo_id" }] },
  "form-empleados.html": { api: "empleados", id: "Empleado_id", fields: ["nombre", "correo", "telefono", "dni"], display: ["nombre", "correo", "telefono", "dni"] },
  "form-envios.html": { api: "envios", id: "Envio_id", fields: ["CiudadO_id", "CiudadD_id", "Transporte_id", "FechaE", "FechaL", "Direccion", "Compra_id"], display: ["FechaE", "FechaL", "Direccion", "CiudadO_id", "CiudadD_id", "Transporte_id", "Compra_id"], aliases: { CiudadO_id: "ciudad_origen_id", CiudadD_id: "ciudad_destino_id", Transporte_id: "transporta_id", FechaE: "fecha_envio", FechaL: "fecha_llegada", Direccion: "direccion", Compra_id: "compra_id" }, relations: [{ field: "CiudadO_id", api: "ciudades", value: "Ciudad_id" }, { field: "CiudadD_id", api: "ciudades", value: "Ciudad_id" }, { field: "Transporte_id", api: "transportadoras", value: "Transporte_id" }, { field: "Compra_id", api: "compras", value: "Compra_id" }] },
  "form-paises.html": { api: "paises", id: "Pais_id", fields: ["nombre"] },
  "form-productos.html": { api: "productos", id: "Producto_id", fields: ["nombre", "precio", "CatPro_id"], aliases: { CatPro_id: "catpro_id" }, relations: [{ field: "CatPro_id", api: "categoriaProductos", value: "CatPro_id" }] },
  "form-transportadoras.html": { api: "transportadoras", id: "Transporte_id", fields: ["nombre"] },
  "form-vehiculos.html": { api: "vehiculos", id: "Vehiculo_id", fields: ["nombre", "Marca", "Modelo", "Placa", "Color", "Cantidad", "Categoria_id", "precio"], display: ["nombre", "Marca", "Modelo", "Placa", "Color", "Cantidad", "Categoria_id"], aliases: { Marca: "marca", Modelo: "modelo", Placa: "placa", Color: "color", Cantidad: "cantidad", Categoria_id: "categoria_id" }, relations: [{ field: "Categoria_id", api: "categorias", value: "Categoria_id" }] }
};

const pageName = location.pathname.split("/").pop();
const config = CRUD_CONFIG[pageName];
const API_ROOT = "http://localhost:3000/api/";

if (config) {
  const form = document.querySelector("form") || document.querySelector(".card-style");
  const getElement = (field) => document.querySelector(`[name="${field}"], #${field}`) || document.querySelector(`[name="${config.aliases?.[field] || field}"]`);
  const inputs = () => [...document.querySelectorAll("input, select, textarea")].filter((element) => element.type !== "hidden");
  let currentId = null;
  const relationLabels = {};

  const ensureField = (field, relation) => {
    let element = getElement(field);
    if (element) return element;
    element = document.createElement(relation ? "select" : "input");
    element.name = field;
    if (!relation) element.type = "text";
    const label = document.createElement("label");
    label.textContent = relation?.label || field;
    const wrapper = document.createElement("div");
    wrapper.className = relation ? "select-style-1" : "input-style-1";
    if (relation) {
      const position = document.createElement("div");
      position.className = "select-position";
      position.append(element);
      wrapper.append(label, position);
    } else {
      wrapper.append(label, element);
    }
    const buttonGroup = document.querySelector(".buttons-group");
    if (buttonGroup && buttonGroup.parentElement === (form || document.body)) {
      buttonGroup.parentElement.insertBefore(wrapper, buttonGroup);
    } else {
      (form || document.body).append(wrapper);
    }
    return element;
  };

  const idInput = document.createElement("input");
  idInput.type = "hidden";
  idInput.id = "crud-id";
  (form || document.body).prepend(idInput);

  const buttons = [...document.querySelectorAll("a")];
  const saveButton = buttons.find((button) => /confirmar|guardar/i.test(button.textContent));
  const updateButton = buttons.find((button) => /actualizar|cancelar/i.test(button.textContent));
  if (updateButton) updateButton.textContent = "Actualizar";
  const deleteButton = document.createElement("a");
  deleteButton.href = "#0";
  deleteButton.className = "main-btn danger-btn-outline rounded-full btn-hover";
  deleteButton.textContent = "Eliminar";
  const buttonList = saveButton?.closest("ul") || updateButton?.closest("ul");
  if (buttonList) {
    const item = document.createElement("li");
    item.append(deleteButton);
    buttonList.append(item);
  }

  config.fields.forEach((field) => ensureField(field, config.relations?.find((relation) => relation.field === field)));

  const valuesFromForm = () => Object.fromEntries(config.fields.map((field) => [field, getElement(field)?.value ?? null]));
  const resetForm = () => {
    currentId = null;
    idInput.value = "";
    inputs().forEach((element) => { element.value = ""; });
  };

  const loadRelations = async () => {
    for (const relation of config.relations || []) {
      const select = ensureField(relation.field, relation);
      let response = await fetch(API_ROOT + relation.api);
      if (!response.ok && relation.fallbackApi) response = await fetch(API_ROOT + relation.fallbackApi);
      if (!response.ok) throw new Error(await response.text());
      const rows = await response.json();
      relationLabels[relation.field] = Object.fromEntries(rows.map((row) => {
        const key = Object.keys(row).find((name) => name.toLowerCase() === relation.value.toLowerCase());
        return [row[key], row.nombre || row.codigo || row.placa || row[key]];
      }));
      select.innerHTML = '<option value="">Selecciona una opción</option>' + rows.map((row) => {
        const key = Object.keys(row).find((name) => name.toLowerCase() === relation.value.toLowerCase());
        const value = row[key];
        const label = row.nombre || row.codigo || row.placa || value;
        return `<option value="${value}">${label}</option>`;
      }).join("");
    }
  };
  const load = async () => {
    const response = await fetch(API_ROOT + config.api);
    if (!response.ok) throw new Error(await response.text());
    const rows = await response.json();
    const tbody = document.querySelector("tbody");
    if (!tbody) return;
    tbody.innerHTML = rows.map((row) => {
      const idKey = config.id;
      const visible = (config.display || config.fields.slice(0, 3)).map((field) => {
        const value = relationLabels[field]?.[row[field]] ?? row[field];
        return `<td>${formatValue(value, field)}</td>`;
      }).join("");
      return `<tr>${visible}<td><button type="button" data-edit="${row[idKey]}">Editar</button></td></tr>`;
    }).join("");
    tbody.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => {
      const idKey = config.id;
      const row = rows.find((item) => String(item[idKey]) === button.dataset.edit);
      currentId = button.dataset.edit;
      idInput.value = currentId;
      config.fields.forEach((field) => { const element = getElement(field); if (element) element.value = inputValue(row[field], element); });
    }));
  };

  const formatValue = (value, field) => {
    if (!value) return "";
    if (/^Fecha|^fecha/.test(field)) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    }
    return value;
  };

  const inputValue = (value, element) => {
    if (value && element?.type === "date") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
    }
    return value ?? "";
  };

  const save = async (event) => {
    event.preventDefault();
    const response = await fetch(API_ROOT + config.api + (currentId ? `/${currentId}` : ""), {
      method: currentId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valuesFromForm())
    });
    const result = await response.json();
    alert(result.mensaje || "Operación terminada");
    if (response.ok) { resetForm(); await load(); }
  };

  saveButton?.addEventListener("click", save);
  updateButton?.addEventListener("click", (event) => { currentId ? save(event) : alert("Selecciona un registro para actualizar"); });
  deleteButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!currentId) return alert("Selecciona un registro");
    const response = await fetch(`${API_ROOT}${config.api}/${currentId}`, { method: "DELETE" });
    const result = await response.json();
    alert(result.mensaje || "Operación terminada");
    if (response.ok) { resetForm(); await load(); }
  });

  document.addEventListener("DOMContentLoaded", async () => {
    try { await loadRelations(); await load(); } catch (error) { alert(error.message); }
  });
}
