import {app} from "./app"
import {SETTINGS} from "./settings";

app.listen(5000, () => {
    console.log(`Listening on port ${SETTINGS.PORT}. Press Ctrl+C to stop.`)
})