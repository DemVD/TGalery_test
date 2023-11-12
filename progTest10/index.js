/*
    Этот JavaScript файл занимается обработкой и отправкой данных на сервер с использованием AJAX,
    получает данные обратно в формате JSON, и на основании полученных данных обновляет таблицу на
    веб-странице, а также обеспечивает функциональность выбора, обновления и удаления строк таблицы.
*/


// Подписываемся на событие "DOMContentLoaded" чтобы обеспечить готовность DOM заранее до работы со скриптом.
document.addEventListener("DOMContentLoaded", function() {
    // Получаем элемент таблицы по его идентификатору.
    var table = document.getElementById("tableCustomerInfo");

    // Создаем объект XMLHttpRequest для отправки HTTP запроса.
    var xhr = new XMLHttpRequest();
    // Открываем соединение с сервером для POST запроса.
    xhr.open("POST", 'loadData.php', true);
    // Задаем заголовок Content-Type для запроса.
    xhr.setRequestHeader("Content-Type", "application/json");
    // Задаем обработчик на изменение состояния запроса.
    xhr.onreadystatechange = function () {
        // Проверяем, что запрос выполнен (readyState === 4) и HTTP status 200 что означает успешное выполнение.
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Получаем и парсим JSON из ответа.
            var json = JSON.parse(xhr.responseText);
            // Для каждой строки в JSON.
            for (var i = 0; i < json.length; i++)
            {
                // Вставляем новую строку перед строкой ввода.
                var row = table.insertRow(table.rows.length - 1);
                // Создаем ячейки для этой строки.
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);

                // Устанавливаем значения для этих ячеек из JSON.
                cell1.innerHTML = json[i].LastName; 
                cell2.innerHTML = json[i].FirstName; 
                cell3.innerHTML = json[i].FathersName; 
            }
        }
    };
    // Отправляем запрос.
    xhr.send();

    // ...
});

 // обработка взаимодействие пользователя с таблицей
 document.addEventListener("DOMContentLoaded", function() {
    var table = document.getElementById("tableCustomerInfo"); // Получаем таблицу

    // Находим элемент в таблице, который был кликнут
    table.addEventListener("click", function(e) {
        var selectedRow = table.getElementsByClassName("selected")[0]; 

        // Удаляем класс "selected" с ранее выбранной строки
        if (selectedRow) {
            selectedRow.classList.remove("selected");
        }

        // Если клик был сделан на строку в таблице, то выбираем эту строку
        if (e.target.tagName === "TD" && e.target.parentNode.id !== "form") {
            e.target.parentNode.classList.add("selected");
            var cells = e.target.parentNode.getElementsByTagName("td");
            // Показываем данные выбранной строки в полях ввода
            document.getElementById("lastNameInput").value = cells[0].innerHTML;
            document.getElementById("firstNameInput").value = cells[1].innerHTML;
            document.getElementById("fathersNameInput").value = cells[2].innerHTML;
        }
    });
});

 // создание новой строки в таблице с данными из полей ввода, 
 // отправка этих данных на сервер. После этого, она очищает поля ввода, готовя их к следующему вводу данных.
function addRow() {
    // Получаем элемент таблицы по его идентификатору
    var table = document.getElementById("tableCustomerInfo");
    // Вставляем новую строку перед строкой полей ввода
    var row = table.insertRow(table.rows.length - 1); 

    // Забираем данные из полей ввода
    var lastName = document.getElementById("lastNameInput").value;
    var firstName = document.getElementById("firstNameInput").value;
    var fathersName = document.getElementById("fathersNameInput").value;

    // Создаём ячейки для новой строки
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    // Устанавливаем значения для ячеек из данных полей ввода
    cell1.innerHTML = lastName;
    cell2.innerHTML = firstName;
    cell3.innerHTML = fathersName;

    // Очищаем поля ввода
    clearInputs();

    // Создаём новый объект XMLHttpRequest для отправки данных на сервер
    var xhr = new XMLHttpRequest();
    // Открываем соединение с сервером для POST запроса
    xhr.open("POST", 'insertData.php', true);
    // Устанавливаем значение заголовка Content-Type для отправки формы
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Задаём обработчик для изменения состояния запроса
    xhr.onreadystatechange = function() {
        // Проверяем, что запрос выполнен (readyState === 4) и HTTP status 200, т.е. успешное выполнение
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Выводим в консоль текст ответа сервера
            console.log('Server response status 200:', this.responseText);
        }
    }
    // Отправляем запрос на сервер с данными из полей ввода
    xhr.send("lastName=" + lastName + "&firstName=" + firstName + "&fathersName=" + fathersName);
}


 // Глобальные переменные, для редактирования на фронте и в БД
var isInEditMode = false; // Находимся ли мы в режиме редактирования
var currentlySelectedRow = null; // Текущая выбранная строка
var oldLastName = ''; // Старое значение фамилии
var oldFirstName = ''; // Старое значение имени
var oldFathersName = ''; // Старое значение отчества


 // isInEditMode = false: помещает данные из выбранной строки (если доступна) в поля ввода,
 // подсвечивает выбранную строку и включает режим редактирования;
 // isInEditMode = true: принимает новые данные из полей ввода, применяет их к выбранной строке
 // и базе данных, снимает подсветку и выключает режим редактирования.
function updateRow() {
    var table = document.getElementById("tableCustomerInfo");
    var selectedRow = currentlySelectedRow ? currentlySelectedRow : table.getElementsByClassName("selected")[0];

    // Если строка не выбрана, мы ничего не делаем
    if (!selectedRow) {
        return;
    }

    // Обновляем 'currentlySelectedRow' когда вы вошли в режим редактирования
    if (!isInEditMode) {
        currentlySelectedRow = selectedRow;
    }

    if (!isInEditMode) { // Если режим редактирования не включен
        // Заполните поля ввода данными выбранной строки
        var cells = selectedRow.getElementsByTagName("td");

        oldLastName = cells[0].innerHTML;
        oldFirstName = cells[1].innerHTML;
        oldFathersName = cells[2].innerHTML;

        document.getElementById("lastNameInput").value = oldLastName;
        document.getElementById("firstNameInput").value = oldFirstName;
        document.getElementById("fathersNameInput").value = oldFathersName;

        // Подсветите выбранную строку
        selectedRow.style.backgroundColor = "lightgreen";
        // Подсветите кнопку
        document.getElementById("editButton").style.backgroundColor = "green";

        // Войдите в режим 'редактирования'.
        isInEditMode = true;
    } else { // Если режим редактирования включен
        // Применяем изменения здесь...
        var newLastName = document.getElementById("lastNameInput").value;
        var newFirstName = document.getElementById("firstNameInput").value;
        var newFathersName = document.getElementById("fathersNameInput").value;

        // Применяем изменения в базе данных
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'editData.php', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log('Server response status 200:', this.responseText);
            }
        }
        xhr.send("oldLastName=" + oldLastName + "&oldFirstName=" + oldFirstName + "&oldFathersName=" + oldFathersName +
                 "&newLastName=" + newLastName + "&newFirstName=" + newFirstName + "&newFathersName=" + newFathersName);
        
        // Обновляем данные в строке
        var cells = selectedRow.getElementsByTagName("td");
        cells[0].innerHTML = newLastName;
        cells[1].innerHTML = newFirstName;
        cells[2].innerHTML = newFathersName;

        // Снимаем подсветку с ранее выбранной строки
        selectedRow.style.backgroundColor = ""; // Или каким было изначально
        // Сбрасываем цвет кнопки
        document.getElementById("editButton").style.backgroundColor = "";

        // Выходим из режима 'редактирования'.
        isInEditMode = false;
        currentlySelectedRow = null; // сбрасываем это, чтобы это не использовалось, когда не следует
        
        // Устанавливаем содержимое полей ввода для пустых строк
        document.getElementById("lastNameInput").value = "";
        document.getElementById("firstNameInput").value = "";
        document.getElementById("fathersNameInput").value = "";
    }
}

 // Удаление выделенной строки в фронте и в БД
function deleteRow() {
    var table = document.getElementById("tableCustomerInfo"); // Получает таблицу

    var selectedRow = table.getElementsByClassName("selected")[0]; // Получает выбранную строку

    if (selectedRow) { // Если строка выбрана
        var lastName = selectedRow.cells[0].innerHTML;
        var firstName = selectedRow.cells[1].innerHTML;
        var fathersName = selectedRow.cells[2].innerHTML;

        // Создаем AJAX запрос и отправляем данные на сервер для удаления
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'removeData.php', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Записываем ответ сервера в консоль
                console.log('Server response status 200:', this.responseText);
            }
        }
        xhr.send("lastName=" + lastName + "&firstName=" + firstName + "&fathersName=" + fathersName);

        // Удаляем строку из таблицы
        table.deleteRow(selectedRow.rowIndex);

        // Очищаем поля ввода
        clearInputs();
    }
}

 // отчистка полей ввода
function clearInputs() {
    // Очищаем поля ввода
    document.getElementById("lastNameInput").value = "";
    document.getElementById("firstNameInput").value = "";
    document.getElementById("fathersNameInput").value = "";
}