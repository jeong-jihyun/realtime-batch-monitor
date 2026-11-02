import { contextBridge } from 'electron';
contextBridge.exposeInMainWorld('desktopInfo',{platform:process.platform,appName:'Realtime Batch Monitor'});
