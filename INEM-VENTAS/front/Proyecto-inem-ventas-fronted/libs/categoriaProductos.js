const API = "http://localhost:3000/api/categoriaProductos";

const frm = document.getElementById("frmCategoriaProducto");

function obtenerDatosFormulario() {
  return {
    nombre: document.getElementById("nombre").value,
  };
}


document.getElementById("btnGuardar").addEventListener("click", async () => {
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
      alert(json.mensaje || "categoria producto registrado");

      frm.reset();
      cargarCategoriasProductos();
    } else {
      alert(json.mensaje || "Error", "red");
    }
  } catch (error) {
    console.error(error);

    alert("No fue posible conectarse con la API");
  }
});

document.getElementById("btnActualizar").addEventListener("click", async () => {
  const id = document.getElementById("CatPro_id").value;

  if (!id) {
    alert("Debe ingresar el código de la categoria del producto");

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
      alert(json.mensaje || "Categoría Producto actualizada");
      frm.reset();
      cargarCategoriasProductos();
    } else {
      alert(json.mensaje || "Error", "red");
    }
  } catch (error) {
    console.error(error);

    alert("No fue posible conectarse con la API");
  }
});

document.getElementById("btnEliminar").addEventListener("click", async () => {
  const id = document.getElementById("CatPro_id").value;

  if (!id) {
    alert("Debe seleccionar un registro");
    return;
  }

  try {
    const respuesta = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    const json = await respuesta.json();

    if (respuesta.ok) {
      alert(json.mensaje || "categoria del producto eliminado");
      frm.reset();
      cargarCategoriasProductos();
    } else {
      alert(json.mensaje || "Error", "red");
    }
  } catch (error) {
    console.error(error);

    alert("No fue posible conectarse con la API");
  }
});

async function cargarCategoriasProductos() {
  const tbody = document.getElementById("tablaCP");

  try {
    const respuesta = await fetch(API);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const catPro = await respuesta.json();
    if (!Array.isArray(catPro)) throw new Error("La respuesta de la API no es una lista");

    tbody.innerHTML = "";

    catPro.forEach((cp) => {
      tbody.innerHTML += `
                <tr>

                    <td>${cp.CatPro_id}</td>
                    <td>${cp.nombre}</td>

                    <td>

                        <button
                            class="btn-small blue"
                            onclick="seleccionarCatPro(${JSON.stringify(cp).replace(/"/g, "&quot;")})">

                            Editar

                        </button>

                    </td>

                </tr>
            `;
    });
  } catch (error) {
    console.error(error);
    if (!tbody) return;

    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.className = "text-center text-sm";
    cell.setAttribute("role", "status");
    cell.textContent = "No se pudieron cargar las categorías. Comprueba que el servidor de la API esté activo.";

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "btn-small blue";
    retryButton.textContent = "Reintentar";
    retryButton.addEventListener("click", cargarCategoriasProductos);

    cell.append(document.createTextNode(" "), retryButton);
    row.append(cell);
    tbody.replaceChildren(row);
  }
}

function seleccionarCatPro(cp) {
  document.getElementById("CatPro_id").value = cp.CatPro_id;
  document.getElementById("nombre").value = cp.nombre;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCategoriasProductos();
});