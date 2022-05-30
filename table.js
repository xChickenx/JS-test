//Первоначальный массив данных, присваиваем ему json и больше не трогаем, если вдруг он где-то ещё понадобится
let initialData = [];
//Дальше уже работаем с этим массивом. который сначала приравниваем к первоначальному массиву
let changedData = [];
//Если массив был отфильтрован, то при сортировке мы будем посылать в конструктор таблицы не изменённый массив, а отфильтрованный
let filtered = false;


//Ждём пока придёт json, сохраняем его в переменную, строим таблицу
Promise.all([createJson()])
.then(values => 
{
    initialData = values[0];
    changedData = initialData;
    buildTable(changedData);
});


//Обнуляем содержимое инпут филд на старте
console.log(document.getElementById("search-input").value = "");

//Получаем значение в инпут филде на keyup и строим отфильтрованную таблицу
$("#search-input").on("keyup", function()
{
    let typedValue = $(this).val();
    //console.log(value);
    changedData = searchTable(typedValue, initialData);
    buildTable(changedData);
    if(typedValue !== "")
        filtered = true;
    else
        filtered = false;
    //console.log(filtered);
})


//Эти переменные для того, чтобы знак сортировки появлялся только на одном столбце
let previousItem = null;
let previousText = "";
//Меняем сортировку столбцов и обновляем строку столбцов каждый раз по клику на столбец
$("th").on("click", function()
{
    let sortedData = changedData;

    let column = $(this).data("column");
    let order = $(this).data("order");
    let text = $(this).html();
    //console.log("Column was clicked " + column, order);

    //Первый клик на столбец - назначем на item текущий столбец
    if (previousItem == null)
    {
        previousItem = this;
        previousText = $(previousItem).html();
    }
    //Второй клик на столбец - сравниваем был ли произведён клик по новому столбцу. Если да, то меняем текст и order прошлого столбца и назначаем на item новый столбец
    else if (previousItem !== null && previousItem !== this)
    {
        $(previousItem).data("order", "none");
        $(previousItem).html(previousText);
        previousText = $(this).html();
        previousItem = this;
    }


    //Меняем тип сортировки текущего столбца
    if (order == "none")
    {
        order = "descending";
        sortedData = sortedData.sort((a,b) => a[column] < b[column] ? 1 : -1);
        text = text.substring(0, text.length - 1);
        text += "&#9650";
    }
    else if (order == "descending")
    {
        order = "ascending";
        sortedData = sortedData.sort((a,b) => a[column] > b[column] ? 1 : -1);
        text = text.substring(0, text.length - 1);
        text += "&#9660";
    }
    else if (order == "ascending")
    {
        order = "descending";
        sortedData = sortedData.sort((a,b) => a[column] < b[column] ? 1 : -1);
        text = text.substring(0, text.length - 1);
        text += "&#9650";
    }

    $(this).data("order", order);
    $(this).html(text);

    buildTable(sortedData);
})










//Возвращаем json
function createJson()
{
    let _json = fetch('https://jsonplaceholder.typicode.com/todos/')
    .then(response => response.json())
    .then(json => json)
    return _json;
}



//Поиск по таблице - принимает значение по которому фильтровать и массив в котором фильтровать. Возвращает отфильтрованные данные
function searchTable(value, data)
{
    let filteredData = [];
    value = value.toLowerCase();
    //console.log(value);

    for (let i = 0; i < data.length; i++)
    {
        let title = data[i].title.toLowerCase();
        //console.log(title);

        if(title.indexOf(value) !== -1)
            filteredData.push(data[i])
    }
    return filteredData;
}



//Конструктор таблицы - принимает массив данных преобразованных из json и строит таблицу
function buildTable(data)
{
    let table = document.getElementById("tableBody");

    table.innerHTML = "";

    for (let i = 0; i < data.length; i++) 
    {
        let row = 
        "<tr>" + 
            "<td>" + data[i].completed + "</td>" +
            "<td>" + data[i].id + "</td>" +
            "<td class='tableTitle'>" + data[i].title + "</td>" +
            "<td>" + data[i].userId + "</td>" +
        "</tr>";
        table.innerHTML += row;
    }
}