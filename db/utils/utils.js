
// not needed. timestamp takes new Date();
function getTimestamp() {
    const date = new Date();

    const year = date.getFullYear();
    const tempMonth = date.getMonth() + 1;
    const month = tempMonth < 10 ? '0' + tempMonth : tempMonth;
    const tempDay = date.getDate();
    const day = tempDay < 10 ? '0' + tempDay : tempDay;
    const tempHour = date.getHours();
    const hour = tempHour < 10 ? '0' + tempHour : tempHour;
    const tempMins = date.getMinutes();
    const minutes = tempMins < 10 ? '0' + tempMins : tempMins;
    const tempSecs = date.getSeconds();
    const seconds = tempSecs < 10 ? '0' + tempSecs : tempSecs;
    const tempZone = date.getTimezoneOffset() /60;
    const zone = tempZone < 0 ? '-' + tempZone : '+' + tempZone;
    

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${zone}:00`;

}

module.exports = { 
    getTimestamp 
};