/*  
    использование стандартного обьекта XMLHttpRequest
    для выполнения async запросов.
    sendRequest() отправляет каждый запрос,
    при получении ответа идет callback
    checkRequestComplete() отслеживает количество
    завершенных запросов, по завершении 3 запросов
    идет вызов allSuccess()
*/

// отслеживание нажатий
document.addEventListener('DOMContentLoaded', function(event){
    // счетчик кол-ва запросов
    var requestCount = 0;
    console.log("Event listener added..");


    // обработчик клика по кнопке
    var buttonSendRequest = document.getElementById("buttonSendRequest");
    // слушаем событие клика
    buttonSendRequest.addEventListener('click', function(){ // анонимные функции
        console.log("Button click registered");

        // первый запрос
        sendRequest("backend1.php", function(){
            console.log("request backend1.php is done..");
            checkRequestComplete();
        });

        // второй запрос
        sendRequest("backend2.php", function(){
            console.log("request backend2.php is done..");
            checkRequestComplete();
        });

        // третий запрос
        sendRequest("backend3.php", function(){
            console.log("request backend3.php is done..");
            checkRequestComplete();
        });
    });

    // отправка POST запроса
    function sendRequest(url, callback){
        // обьект http взаимодействует с серв посредством http
        var xmlHttpReq = new XMLHttpRequest();

        // инициализация запроса open(метод, адрес, асинхронное выполнение)
        xmlHttpReq.open('POST', url, true);

        // обработка события смены состояния
        xmlHttpReq.onreadystatechange = function(){
            // проверка завершения запроса, статус 200 - успешный запрос
            if(xmlHttpReq.readyState === XMLHttpRequest.DONE && xmlHttpReq.status === 200){
                // вызов переданной функции обратного вызова
                callback();
            }
        };
        // отправка запроса, без передачи данных
        xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttpReq.send();
    }

    // проверка завершения всех запросов (3)
    function checkRequestComplete(){
        // инкремент счетчика
        requestCount++;

        // проверка счетчика, если было 3 запроса
        if(requestCount === 3){
            // вывод alert об успехе трех запросов
            allSuccess();
        }
    }

    // вывод alert об успехе окончания трех запросов
    function allSuccess(){
        alert("УРА!");
    }
});