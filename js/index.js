/**
 * Project: Student Management (CRUD)
 * Features:
 *  + Create student
 *  + Read students
 *  + Delete student
 *  + Update student
 *  + Search student (id + name)
 *  + Validate form
 * PRD + design
 * phân rã lớp đối tượng
 *
 */



var studentList = [];

function createStudent() {
  var isValid = validateForm();

  if (!isValid) return;

  // lấy thông tin từ input
  var id = document.getElementById("txtMaSV").value;
  var name = document.getElementById("txtTenSV").value;
  var email = document.getElementById("txtEmail").value;
  var dob = document.getElementById("txtNgaySinh").value;
  var course = document.getElementById("khSV").value;
  var math = +document.getElementById("txtDiemToan").value;
  var physic = +document.getElementById("txtDiemLy").value;
  var chemistry = +document.getElementById("txtDiemHoa").value;

  // // check trùng id
  var index = findById(id);

  if (index !== -1) {
    alert("Id bị trùng!");
    return;
  }

  // // tạo ra đối tượng lưu thông tin sv
  var student = new Student(
    id,
    name,
    email,
    dob,
    course,
    math,
    physic,
    chemistry
  );

  // // bỏ đối tượng sinh viên vào ds
  studentList.push(student);

  // // in danh sách sinh viên ra màn hình
  renderStudents();

  // // lưu ds xuống local storage
  saveLocalStorage();
}

function renderStudents(data) {
  // if (!data) {
  //   data = studentList;
  // }

  data = data || studentList;

  var result = "";
  for (var i = 0; i < data.length; i++) {
    var currentStudent = data[i];
    result += `<tr>
                    <td>${currentStudent.id}</td>
                    <td>${currentStudent.name}</td>
                    <td>${currentStudent.email}</td>
                    <td>${currentStudent.dob}</td>
                    <td>${currentStudent.course}</td>
                    <td>${currentStudent.calcGPA()}</td>
                    <td>
                      <button onclick="deleteStudent('${
                        currentStudent.id
                      }')" class="btn btn-danger">Delete</button>

                      <button onclick="getStudentInfo('${
                        currentStudent.id
                      }')" class="btn btn-info">Update</button>
                    </td>
                </tr>`;
  }

  document.getElementById("tbodySinhVien").innerHTML = result;
}

//input: id
function deleteStudent(id) {
  var index = findById(id);
  if (index === -1) return alert("Id không tồn tại");
  studentList.splice(index, 1);

  renderStudents();

  saveLocalStorage();
}

// update 1: input: id
function getStudentInfo(id) {
  // tìm đối tượng từ id
  var index = findById(id);

  if (index === -1) return alert("Id không hợp lệ!!");

  var foundStudent = studentList[index];

  // đưa tất cả thông tin lên form

  document.getElementById("txtMaSV").value = foundStudent.id;
  document.getElementById("txtTenSV").value = foundStudent.name;
  document.getElementById("txtEmail").value = foundStudent.email;
  document.getElementById("txtNgaySinh").value = foundStudent.dob;
  document.getElementById("khSV").value = foundStudent.course;
  document.getElementById("txtDiemToan").value = foundStudent.math;
  document.getElementById("txtDiemLy").value = foundStudent.physic;
  document.getElementById("txtDiemHoa").value = foundStudent.chemistry;

  // ẩn nút thêm, hiện nút lưu thay đổi
  document.getElementById("btnCreate").style.display = "none";
  document.getElementById("btnUpdate").style.display = "inline-block";

  // disable input mã sinh viên
  document.getElementById("txtMaSV").disabled = true;
}

// update 2:
function updateStudent() {
  // lấy value từ input
  var id = document.getElementById("txtMaSV").value;
  var name = document.getElementById("txtTenSV").value;
  var email = document.getElementById("txtEmail").value;
  var dob = document.getElementById("txtNgaySinh").value;
  var course = document.getElementById("khSV").value;
  var math = +document.getElementById("txtDiemToan").value;
  var physic = +document.getElementById("txtDiemLy").value;
  var chemistry = +document.getElementById("txtDiemHoa").value;
  // tìm ra sv trong ds bằng id
  var index = findById(id);

  if (index === -1) return alert("Id không hợp lệ!!");

  var foundStudent = studentList[index];

  // cập nhật từng field

  foundStudent.name = name;
  foundStudent.email = email;
  foundStudent.dob = dob;
  foundStudent.course = course;
  foundStudent.math = math;
  foundStudent.physic = physic;
  foundStudent.chemistry = chemistry;

  renderStudents();

  saveLocalStorage();

  // clear : reset form, hiện lại nút thêm, ẩn nút lưu, gỡ disable ra khỏi input masv
  document.getElementById("btnCreate").style.display = "block";
  document.getElementById("btnUpdate").style.display = "none";

  document.getElementById("txtMaSV").disabled = false;

  document.getElementById("btnReset").click();
}

function searchStudents() {
  var results = [];

  // lấy keyword từ input
  var keyword = document.getElementById("txtSearch").value.toLowerCase().trim();

  for (var i = 0; i < studentList.length; i++) {
    var currentStudent = studentList[i];
    if (
      currentStudent.id === keyword ||
      currentStudent.name.toLowerCase().includes(keyword)
    ) {
      results.push(currentStudent);
    }
  }

  renderStudents(results);
}

// input :id => output: vị trí
function findById(id) {
  for (var i = 0; i < studentList.length; i++) {
    if (studentList[i].id === id) {
      return i;
    }
  }
  return -1;
}

function saveLocalStorage() {
  var studentListJSON = JSON.stringify(studentList);
  localStorage.setItem("list", studentListJSON);
}

function getLocalStorage() {
  var studentListJSON = localStorage.getItem("list");
  if (!studentListJSON) return;

  var studentListLocal = JSON.parse(studentListJSON);
  studentList = mapData(studentListLocal);

  renderStudents();
}

// input: data local => output: data mới
function mapData(studentListLocal) {
  var result = [];
  for (var i = 0; i < studentListLocal.length; i++) {
    var currentStudent = studentListLocal[i];

    var copiedStudent = new Student(
      currentStudent.id,
      currentStudent.name,
      currentStudent.email,
      currentStudent.dob,
      currentStudent.course,
      currentStudent.math,
      currentStudent.physic,
      currentStudent.chemistry
    );

    result.push(copiedStudent);
  }

  return result;
}

getLocalStorage();

// truthy vs falsy: null, undefined, 0, "", NaN, false

// var res = "a" || "";
// var res1 = 0 || 2;
// var res2 = 0 || "" || null;

// var res3 = 0 && 2;
// var res4 = "aavv" && 0;
// var res5 = "aavv" && "abc";

// console.log(res, res1, res2, res3, res4, res5);

// ---------------------------- VALIDATIONS ---------------------------
function validateForm() {
  var isValid = true;
  var id = document.getElementById("txtMaSV").value;
  var name = document.getElementById("txtTenSV").value;
  var email = document.getElementById("txtEmail").value;
  var dob = document.getElementById("txtNgaySinh").value;
  var math = document.getElementById("txtDiemToan").value;
  var physic = document.getElementById("txtDiemLy").value;
  var chemistry = document.getElementById("txtDiemHoa").value;

  console.log(math, physic, chemistry);

  isValid &= checkRequired(id, "spanMaSV") && checkLength(id, "spanMaSV", 4, 8);

  isValid &=
    checkRequired(name, "spanTenSV") && checkCharacter(name, "spanTenSV");

  isValid &=
    checkRequired(email, "spanEmailSV") && checkEmail(email, "spanEmailSV");

  isValid &= checkRequired(dob, "spanNgaySinh");

  isValid &= checkCourse("khSV", "spanKhoaHoc");

  isValid &= checkRequired(math, "spanToan") && checkNumner(math, "spanToan");

  isValid &= checkRequired(physic, "spanLy") && checkNumner(physic, "spanLy");

  isValid &=
    checkRequired(chemistry, "spanHoa") && checkNumner(chemistry, "spanHoa");

  return isValid;
}

function checkRequired(val, spanId) {
  if (val.length > 0) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = "* Trường này bắt buộc nhập";
  return false;
}

function checkLength(val, spanId, min, max) {
  if (val.length >= min && val.length <= max) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(
    spanId
  ).innerHTML = `* Độ dài phải từ ${min} tới ${max} kí tự`;
  return false;
}

function checkCharacter(val, spanId) {
  var letter =
    "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
    "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
    "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";

  if (val.match(letter)) {
    //true
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  //false
  document.getElementById(spanId).innerHTML = "* Vui lòng nhập chuỗi kí tự";
  return false;
}

function checkEmail(val, spanId) {
  var letter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (val.match(letter)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  //false
  document.getElementById(spanId).innerHTML =
    "* Vui lòng nhập đúng định dạng email";
  return false;
}

function checkNumner(val, spanId) {
  var letter = /^[0-9]+$/;
  if (val.match(letter)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  //false
  document.getElementById(spanId).innerHTML = "* Vui lòng nhập số";
  return false;
}

function checkCourse(selectId, spanId) {
  if (document.getElementById(selectId).selectedIndex !== 0) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = "* Vui lòng chon KH";
  return false;
}

function checkPattern() {}

// regular expression
