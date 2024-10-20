import {app} from "./app"
import {SETTINGS} from "./settings";
import {ConnectDB} from "./db";

const port = process.env.PORT || SETTINGS.PORT || 4000

const startApp = async () => {
   await ConnectDB()
   app.listen(port, () => {
      console.log(`Listening on port ${port}. Press Ctrl+C to stop.`)
   })
}

startApp()
