// Recuperar información del localStorage
let storedDataJSON = localStorage.getItem("courseData");
let storedData = JSON.parse(storedDataJSON); // Convertir la cadena JSON de nuevo a un objeto JavaScript
console.log(storedData);

let teacherID = storedData.usuarioID;
let teacherName = storedData.teacherName;
let subjectid = storedData.subjectid;

// Variables html
let user_up = document.getElementById("user_up");
let saveChangesButton = document.getElementById("saveChangesButton");
let studentsBody = document.getElementById("studentsBody");
user_up.innerHTML = teacherName;

// -------------- CONSULTA API -------------------//
async function infoStudentsForNote() {
  let infoForNotes = "http://localhost:3000/teachers/grades";
  let info = await fetch(infoForNotes);
  let infojs = await info.json();

  return infojs;
}

//let course = 3; // se debe registrar de acuerdo al click 3-2
let course = storedData.courseID;

//-------------- CREAR TABLA ------------------//
infoStudentsForNote().then((infojs) => {
  infojs.forEach((student) => {

    //console.log("curso",student.courseid,"soy student.subjectid: ",student.subjectid, "==",subjectid)
    //if (student.courseid == course && student.subjectid == subjectid ) {
      // Crea una nueva fila
      if (student.courseid == course){
      let row = document.createElement("tr");

      // Crea y agrega las celdas a la fila
      let nameCell = document.createElement("td");
      nameCell.innerHTML = `<p type="text" class="studentName" title="${
        student.user_studentid
      }" >${
        student.user_student.name_student + " " + student.user_student.last_name
      }</>`;
      //nameCell.innerHTML = `<span type="text" class="studentName" value="${student.user_studentid}" >${student.user_studentid}</>`
      row.appendChild(nameCell);

      let grade1Cell = document.createElement("td");
      grade1Cell.innerHTML = `<input type="text" class="gradeInput" value="${student.first_period}" />`;
      row.appendChild(grade1Cell);

      let grade2Cell = document.createElement("td");
      grade2Cell.innerHTML = `<input type="text" class="gradeInput" value="${student.second_period}" />`;
      row.appendChild(grade2Cell);

      let grade3Cell = document.createElement("td");
      grade3Cell.innerHTML = `<input type="text" class="gradeInput" value="${student.third_period}" />`;
      row.appendChild(grade3Cell);

      let studentsBody = document.getElementById("studentsBody");

      if (studentsBody !== null) {
        // Agrega la fila al cuerpo de la tabla
        studentsBody.appendChild(row);
      } else {
        console.error("Elemento studentsBody no encontrado.");
      }
    }
  });
});

// -------------- EVENTO LISTENER -------------------//
saveChangesButton.addEventListener("click", async function () {
  // Recupera las filas de la tabla
  let rows = studentsBody.getElementsByTagName("tr");

  // Crea un objeto para almacenar los datos de los estudiantes
  let studentData = [];

  // Recorre cada fila de la tabla
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];

    // Obtiene las celdas de la fila
    let cells = row.getElementsByTagName("td");

    // Obtiene el nombre del estudiante y las calificaciones
    let studentName = cells[0].getElementsByTagName("p")[0].title;

    let grade1 = cells[1].getElementsByTagName("input")[0].value;
    let grade2 = cells[2].getElementsByTagName("input")[0].value;
    let grade3 = cells[3].getElementsByTagName("input")[0].value;

    // Crea un objeto con la información del estudiante
    let studentObj = {
      user_studentid: studentName,

      first_period: grade1,
      second_period: grade2,
      third_period: grade3,
      subjectid: subjectid,
    };
    console.log("studentObj", i, ":", studentObj);

    // Configuración de la solicitud
    const url = "http://localhost:3000/teacher/registerGrade";
    const datos = studentObj;
    // Solicitud PUT
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Asegúrate de establecer el tipo de contenido correcto
      },
      body: JSON.stringify(datos), // Convierte el objeto a una cadena JSON
    })
      .then((response) => response.json())
      .then((data) => console.log("Respuesta:", data))
      .catch((error) => console.error("Error:", error));

    /* Enviar solicitud sin guardarlo en el local
    // Agrega el objeto al array
    studentData.push(studentObj);
  }

  // Almacena el objeto en el localStorage
  localStorage.setItem("studentData", JSON.stringify(studentData));

// Enviar datos al backend
try {
  const response = await fetch('https://localhost:3000/teacher/registerGrade', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  if (response.ok) {
    console.log('Calificaciones enviadas correctamente al backend.');
  } else {
    console.error('Error al enviar las calificaciones al backend:', response.statusText);
  }
} catch (error) {
  console.error('Error de red al enviar las calificaciones al backend:', error);
}
*/
  }
});
