let fs = require('fs');
let Store = require('./store');
const { BrowserWindow } = require('electron').remote;
const uuid = require('uuid/v4');

// Declare Vars
let fsData = {};
let store = new Store({
    configName: 'user-preferences',
    defaults: {
        servers: []
    }
});

// Get Server List from DOM
let serverList = document.getElementById('server-list');

let createServerListItems = item => {
    // Create DOM Element
    let serverListItem = document.createElement('DIV');
    // Add Class for With
    serverListItem.classList.add('w-5/6');
    // Add ID
    serverListItem.id = `${item.id}`;
    // Add inner HTML
    serverListItem.innerHTML = `<div class="flex rounded shadow p-4 m-4 bg-black hover:shadow-lg">
        <div class="self-center mr-3">
            <button id="rmBtn${item.id}"><i class="text-white fas fa-times-circle"></i></button>
        </div>  
        <div id="serverListItemInner${item.id}"  class="pointer flex w-full justify-between">
            <div>
                <strong>${item.name}</strong>
                <p>${item.url}</p>
            </div>
            <i class="self-center fas fa-arrow-right"></i> 
        </div>
    </div>`;
    // Add Element to DOM
    serverList.appendChild(serverListItem);
    // Add Click Event
    document.getElementById(`serverListItemInner${item.id}`).addEventListener('click', () => {
        // Open new Window
        let serverWin = new BrowserWindow({ width: 1000, height: 600 });
        serverWin.loadURL(item.url);
    });
    document.getElementById(`rmBtn${item.id}`).addEventListener('click', () => {
        removeServer(item.id);
    });
};

let readFile = () => {
    fsData.servers = store.get('servers');
    fsData.servers.forEach(element => {
        createServerListItems(element);
    });
};

readFile();

let addServer = (name, url) => {
    let item = {
        name: name,
        url: url,
        id: uuid()
    };
    fsData.servers.push(item);
    store.set('servers', fsData.servers);
    createServerListItems(item);
};

let removeServer = id => {
    fsData.servers = fsData.servers.filter(servers => servers.id !== id);
    store.set('servers', fsData.servers);
    document.getElementById(id).outerHTML = '';
};

document.getElementById('addBtn').addEventListener('click', () => {
    document.getElementById('addModal').classList.remove('slideOutDown');
    document.getElementById('addModal').classList.remove('hidden');
    document.getElementById('addModal').classList.add('fadeInUp');
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('addModal').classList.remove('fadeInUp');
    document.getElementById('addModal').classList.add('slideOutDown');
});

document.getElementById('newServerSave').addEventListener('click', () => {
    addServer(document.getElementById('newServerName').value, document.getElementById('newServerUrl').value);
    document.getElementById('addModal').classList.remove('fadeInUp');
    document.getElementById('addModal').classList.add('slideOutDown');
});
