import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';
function createWindow() {
 const window=new BrowserWindow({width:1180,height:820,minWidth:760,minHeight:620,backgroundColor:'#0b1020',title:'Realtime Batch Monitor',webPreferences:{preload:join(__dirname,'../preload/index.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 if(process.env.ELECTRON_RENDERER_URL) void window.loadURL(process.env.ELECTRON_RENDERER_URL); else void window.loadFile(join(__dirname,'../renderer/index.html'));
}
app.whenReady().then(()=>{createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
