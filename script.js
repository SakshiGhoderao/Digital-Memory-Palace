let rooms = JSON.parse(localStorage.getItem("rooms")) || [];
let currentRoomIndex = null;

const roomsContainer = document.getElementById("rooms");
const addRoomBtn = document.getElementById("addRoomBtn");
const memoriesContainer = document.getElementById("memories");
const addMemoryBtn = document.getElementById("addMemoryBtn");
const mainView = document.getElementById("mainView");
const roomView = document.getElementById("roomView");
const roomTitle = document.getElementById("roomTitle");

const memTitle = document.getElementById("memTitle");
const memText = document.getElementById("memText");
const memEmotion = document.getElementById("memEmotion");
const memImage = document.getElementById("memImage");
const saveMemoryBtn = document.getElementById("saveMemoryBtn");
const roomTheme = document.getElementById("roomTheme");
const filterEmotion = document.getElementById("filterEmotion");
const modeBtn = document.getElementById("modeBtn");
const dashboard = document.getElementById("dashboard");

//Dark mode
modeBtn.onclick = () => {
    document.body.classList.toggle("dark");
};


//filter
filterEmotion.onchange = renderMemories;

//save Data
function save(){
    localStorage.setItem("rooms", JSON.stringify(rooms));
}

//render Rooms
function renderRooms(){
    roomsContainer.innerHTML = "";

    rooms.forEach((room, index) => {
        const div = document.createElement("div");
        div.className = "room";
        div.textContent = room.name;
        div.onclick = () => openRoom(index);
            openRoom(index);
        
        roomsContainer.appendChild(div);
    });
}

//Open rooms
function openRoom(index){
    currentRoomIndex = index;

    const page = document.getElementById("page");
    page.classList.add("flip");
    setTimeout(() => {
        mainView.style.display = "none";
        roomView.style.display = "block";
        roomTitle.textContent = rooms[index].name;
        renderMemories();
        page.classList.remove("flip");
    },600);
}

//Back
function goBack(){
    roomView.style.display = "none";
    mainView.style.display = "block";
}

//render Memories
function renderMemories(){
    memoriesContainer.innerHTML = "";

    let list = rooms[currentRoomIndex].memories;

    if(filterEmotion.value !== "all"){
        list = list.filter(m => m.emotion === filterEmotion.value);
    }

    list.forEach(memory =>{
        const div = document.createElement("div");
        div.className = "memory";
        div.style.background = memory.theme;
        
        div.innerHTML = `
        <strong>${memory.title}</strong>
        <small>${memory.date} ${memory.emotion}<br></small>
        <p>${memory.text}</p><br>
        ${memory.image ? `<img src="${memory.image}">` : ""}
        `;

        memoriesContainer.appendChild(div);
    }); 
}

//Dashboard
function updateDashboard(){
    const memories = rooms[currentRoomIndex].memories;

    let emotions = {};
    memories.forEach(m => {
        emotions[m.emotion] = (emotions[m.emotion] || 0) + 1;
    });

    let html = "<strong>Memory Insights</strong><br>";
    for(let e in emotions){
        html += `${emotions[e]} memories<br>`;
    }

    dashboard.innerHTML = html;
}

//Add rooms
document.getElementById("addRoomBtn").onclick =  () =>{
    const name = prompt("Enter room name:");
    if(!name) return;

    rooms.push({name, memories:[]});
    save();
    renderRooms();
};

//save Memory
saveMemoryBtn.onclick =  () => {
    const title = memTitle.value;
    const text = memText.value;
    const emotion = memEmotion.value;
    const imageFile = memImage.files[0];

    if(!title || !text) return alert("Fill all fields");

    const reader = new FileReader();

    reader.onload = function(){

    rooms[currentRoomIndex].memories.push({
        title, 
        text, 
        emotion,
        date:new Date().toLocaleString(),
        image: reader.result,
        theme:roomTheme.value
    });
    save();
    renderMemories();
    updateDashboard();
    

    memTitle.value = "";
    memText.value = "";
    memImage.value = "";
};

if(imageFile) reader.readAsDataURL(imageFile);
else reader.onload();
};


renderRooms();