const API = "http://localhost:3000/api/categoriaProductos";

const frm = document.getElementById("frmEstudiante");

function obtenerDatosFormulario() {
  return {
    nombre: document.getElementById("nombre").value,
  };
}

function notificar(mensaje, color = "green") {
  M.toast({
    html: mensaje,
    classes: color,
  });
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
      notificar(json.mensaje || "Estudiante registrado");

      frm.reset();
      cargarCategoriasProductos();
    } else {
      notificar(json.mensaje || "Error", "red");
    }
  } catch (error) {
    console.error(error);

    notificar("No fue posible conectarse con la API", "red");
  }
});

document.getElementById("btnActualizar").addEventListener("click", async () => {
  const id = document.getElementById("codEstudiante").value;

  if (!id) {
    notificar("Debe ingresar el código del estudiante", "orange");

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
      notificar(json.mensaje || "Estudiante actualizado");
      frm.reset();
      cargarCategoriasProductos();
    } else {
      notificar(json.mensaje || "Error", "red");
    }
  } catch (error) {
    console.error(error);

    notificar("No fue posible conectarse con la API", "red");
  }
});

async function cargarCategoriasProductos() {
  try {
    const respuesta = await fetch(API);

    const catPro = await respuesta.json();

    const tbody = document.getElementById("tablaCP");

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

    notificar("No fue posible cargar", "red");
  }
}

function seleccionarCatPro(catPro) {
  document.getElementById("CatPro_id").value = catPro.CatPro_id;
  document.getElementById("nombre").value = catPro.nombre;

  // Actualiza las etiquetas de Materialize
  M.updateTextFields();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCategoriasProductos();
});