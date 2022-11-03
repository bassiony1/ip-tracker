const ipsec = document.querySelector('[data-ip]')
const locsec = document.querySelector('[data-loc]')
const timesec = document.querySelector('[data-time]')
const spsec = document.querySelector('[data-sp]')
const searchBtn = document.querySelector('[data-btn]')
const inputtext = document.querySelector('[data-input]')
let IP = '';
let longitude = 0;
let latitude = 0;
let serviceProvider = '';
let loc = ''
let timezone = ''
let map = null
let searchip = ''
window.addEventListener('load' , async ()=>{
    
    await get_apiData(IP);
    await get_serviceProvider(IP)
     map = L.map('map' , {
        center: [latitude,longitude],
        zoom: 13,
        minZoom : 13,
        zoomControl : false
    });
    adjust_data();
    drawMap();
    
})

inputtext.addEventListener('input' , (e)=>{
    searchip = e.target.value;
})

searchBtn.addEventListener('click' , async ()=>{
    if(is_valid(searchip))
    {
    await get_apiData(searchip);
    await get_serviceProvider(searchip)
    map.setView(new L.LatLng(latitude, longitude), 13);
    drawMap();
    adjust_data();
    searchip=''
    inputtext.value = ''
    }
})

function is_valid(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }  
    alert("You have entered an invalid IP address!")  
    return (false)  
  }  
function adjust_data() {
    ipsec.innerText = IP ; 
    locsec.innerText = loc ; 
    timesec.innerText = timezone ; 
    spsec.innerText = serviceProvider ; 
}


async function get_serviceProvider(ip) {
    let res = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=at_Rih4DEF07WASxcHXKyXYHJBYTXS5R&ipAddress=${ip}`)
    let data = await res.json();
    serviceProvider =  data.as.name;
    loc =  `${data.location.region}\\${data.location.country}`;
    timezone =  data.location.timezone;
}
async function get_apiData(ip){
    
    let lin = (ip === '' ) ?  `https://api.ipdata.co?api-key=6c6660071b42de7cf84aaa031ef15896e7809adf09de4bc78eb771fd` : `https://api.ipdata.co/${ip}?api-key=6c6660071b42de7cf84aaa031ef15896e7809adf09de4bc78eb771fd`
    
    let res = await fetch(lin)
    let d = await res.json();
    IP = d.ip ;
    longitude = d.longitude;
    latitude = d.latitude;
    
}

function drawMap() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
    var marker = L.marker([latitude,longitude] , {title : loc , alt :loc}).addTo(map)
    var circle = L.circle([latitude, longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
}