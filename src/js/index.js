let fs = require('fs');
let Store = require('../store');
const { BrowserWindow } = require('electron').remote;
const uuid = require('uuid/v4');

// Declare vars
let fsData = {};
let store = new Store({
    configName: 'user-preferences',
    defaults: {
        servers: []
    }
});
let online = navigator.onLine;

// Check if user is online
if (!online) {
    document.getElementById('errorMsg').innerHTML = 'No Internet connection!';
}

// Get server list from DOM
let serverList = document.getElementById('server-list');

let createServerListItems = item => {
    // Create DOM element
    let serverListItem = document.createElement('DIV');
    // Add class for with
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
    // Add element to DOM
    serverList.appendChild(serverListItem);
    // Add click event
    document.getElementById(`serverListItemInner${item.id}`).addEventListener('click', () => {
        // Open new window with url
        let serverWin = new BrowserWindow({ width: 1000, height: 600 });
        serverWin.loadURL(item.url);
    });
    document.getElementById(`rmBtn${item.id}`).addEventListener('click', () => {
        removeServer(item.id);
    });
};

// Get data from local storage
let readFile = () => {
    fsData.servers = store.get('servers');
    fsData.servers.forEach(element => {
        // Create server list item with data
        createServerListItems(element);
    });
};

// Get initial data from local storage
readFile();

// Add new server
let addServer = (name, url) => {
    let item = {
        name: name,
        url: url,
        id: uuid()
    };
    fsData.servers.push(item);
    // Write new data to local storage
    store.set('servers', fsData.servers);
    // Create server list item with data
    createServerListItems(item);
};

// Remove server list item
let removeServer = id => {
    // Remove item form array
    fsData.servers = fsData.servers.filter(servers => servers.id !== id);
    // Write new data to local storage
    store.set('servers', fsData.servers);
    // Clean up DOM element
    document.getElementById(id).outerHTML = '';
};

// Open addServer Modal
document.getElementById('addBtn').addEventListener('click', () => {
    // Add and remove classes for animation
    document.getElementById('addModal').classList.remove('slideOutDown');
    document.getElementById('addModal').classList.remove('hidden');
    document.getElementById('addModal').classList.add('fadeInUp');
});

// Close addServer Modal
document.getElementById('closeModalBtn').addEventListener('click', () => {
    // Add and remove classes for animation
    document.getElementById('addModal').classList.remove('fadeInUp');
    document.getElementById('addModal').classList.add('slideOutDown');
    // Reset error Msg
    document.getElementById('errorMsg').innerHTML = '';
});

document.getElementById('newServerSave').addEventListener('click', e => {
    e.preventDefault();
    let urlPrefix = document.getElementById('newServerUrlPrefix').value;
    let url = document.getElementById('newServerUrl').value;
    let port = document.getElementById('newSeverPort').value;
    let name = document.getElementById('newServerName').value;
    // Clean up url
    url = url
        .replace('http://', '')
        .replace('https://', '')
        .replace('www.', '');
    let readyUrl = `${urlPrefix}${url}:${port}`;
    if (name && readyUrl) {
        addServer(name, readyUrl);
        // Add and remove classes for animation
        document.getElementById('addModal').classList.remove('fadeInUp');
        document.getElementById('addModal').classList.add('slideOutDown');
        // Reset values of inputs
        document.getElementById('newServerUrl').value = '';
        document.getElementById('newServerName').value = '';
    } else {
        // Display error Msg
        document.getElementById('errorMsg').innerHTML = 'Please fill out all Inputs';
    }
});
