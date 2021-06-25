const _ = require("lodash");
const electron = require("electron");
const { app, BrowserWindow } = electron;

app.on("ready", () =>
  setTimeout(() => {
    let win;
    let displays = electron.screen.getAllDisplays();
    let bwBounds = { ...displays[0].bounds };
    displays.forEach((d, i) => {
      console.log(d);
      console.log(bwBounds);
      bwBounds.x = d.bounds.x < bwBounds.x ? d.bounds.x : bwBounds.x;
      bwBounds.y = d.bounds.y < bwBounds.y ? d.bounds.x : bwBounds.y;
      bwBounds.width += d.bounds.width;
      bwBounds.height =
        d.bounds.height > bwBounds.height ? d.bounds.height : bwBounds.height;
    });
    win = new BrowserWindow({
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      // enableLargerThanScreen: true,
      //useContentSize: true,
      skipTaskbar: true,
      // acceptFirstMouse: true, // Advised for a more intuitive experience
      titleBarStyle: "hidden",
      hasShadow: false,
      backgroundColor: "#00000000",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    });
    if (!_.isEmpty(bwBounds)) {
      console.log("BWBOUNDS", bwBounds);
      win.setBounds({
        x: bwBounds.x,
        y: bwBounds.y,
        width: bwBounds.width,
        height: bwBounds.height
      });
      win.setSize(bwBounds.width, bwBounds.height);
    }
    win.loadFile("src/index.html");
    win.webContents.openDevTools({ mode: "undocked" });
    console.log(
      "SIZE",
      win.getSize(),
      "CONTENTSIZE",
      win.getContentSize(),
      "BOUNDS",
      win.getBounds(),
      "CONTENTBOUNDS",
      win.getContentBounds()
    );
    win.webContents.on("devtools-focused", () => {
      win.webContents.focus();
    });
    win.setIgnoreMouseEvents(true, {forward: true})
  }, 250)
); // Transparency on Linux requires a timeout

app.on("window-all-closed", () => app.quit());
