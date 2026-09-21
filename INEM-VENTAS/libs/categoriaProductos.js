const API = "http://localhost:3000/api/categoriaProductos";

// ID corregido para que coincida con el HTML
const frm = document.getElementById("frmCategoriaProducto");

function obtenerDatosFormulario() {
  return {
    nombre: document.getElementById("nombre").value,
  };
}

function notificar(mensaje, color = "green") {
  alert(mensaje);
}

// BOTÓN GUARDAR (CREAR)
document.getElementById("btnGuardar").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const datos = obtenerDatosFormulario();

    const respuesta = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    const json = await respuesta.json();

    if (respuesta.ok) {
      notificar(json.mensaje || "Categoría registrada con éxito");
      if (frm) frm.reset();
      cargarCategoriasProductos();
    } else {
      notificar(json.mensaje || "Error al registrar", "red");
    }
  } catch (error) {
    console.error(error);
    notificar("No fue posible conectarse con la API", "red");
  }
});

// BOTÓN ACTUALIZAR (EDITAR)
document.getElementById("btnActualizar").addEventListener("click", async (e) => {
  e.preventDefault();
  const id = document.getElementById("CatPro_id").value;

  if (!id) {
    notificar("Debe seleccionar una categoría de la lista para actualizar");
    return;
  }

  try {
    const datos = obtenerDatosFormulario();

    const respuesta = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    const json = await respuesta.json();

    if (respuesta.ok) {
      notificar(json.mensaje || "Categoría actualizada correctamente");
      if (frm) frm.reset();
      document.getElementById("CatPro_id").value = "";
      cargarCategoriasProductos();
    } else {
      notificar(json.mensaje || "Error al actualizar", "red");
    }
  } catch (error) {
    console.error(error);
    notificar("No fue posible conectarse con la API", "red");
  }
});

// BOTÓN ELIMINAR
document.getElementById("btnEliminar").addEventListener("click", async (e) => {
  e.preventDefault();
  const id = document.getElementById("CatPro_id").value;

  if (!id) {
    notificar("Debe seleccionar una categoría para eliminar");
    return;
  }

  if (!confirm("¿Está seguro de que desea eliminar esta categoría?")) {
    return;
  }

  try {
    const respuesta = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await respuesta.json();

    if (respuesta.ok) {
      notificar(json.mensaje || "Categoría eliminada correctamente");
      if (frm) frm.reset();
      document.getElementById("CatPro_id").value = "";
      cargarCategoriasProductos();
    } else {
      notificar(json.mensaje || "Error al eliminar", "red");
    }
  } catch (error) {
    console.error(error);
    notificar("No fue posible conectarse con la API", "red");
  }
});

// CARGAR LISTADO DE CATEGORÍAS
async function cargarCategoriasProductos() {
  try {
    const respuesta = await fetch(API);
    const catPro = await respuesta.json();

    const tbody = document.getElementById("tablaCP");
    tbody.innerHTML = "";

    if (catPro.length === 0) {
      tbody.innerHTML = `<tr><td colspan="2" class="text-center text-sm">No hay registros guardados.</td></tr>`;
      return;
    }

    catPro.forEach((cp) => {
      tbody.innerHTML += `
        <tr>
          <td><h6 class="text-sm font-medium">${cp.nombre}</h6></td>
          <td>
            <button 
              class="main-btn primary-btn btn-hover btn-sm" 
              onclick='seleccionarCatPro(${JSON.stringify(cp)})'>
              Editar / Seleccionar
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error(error);
    notificar("No fue posible cargar las categorías desde el servidor", "red");
  }
}

// SELECCIONAR CATEGORÍA DE LA TABLA
function seleccionarCatPro(catPro) {
  document.getElementById("CatPro_id").value = catPro.CatPro_id;
  document.getElementById("nombre").value = catPro.nombre;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// INICIALIZAR AL CARGAR PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  cargarCategoriasProductos();
});