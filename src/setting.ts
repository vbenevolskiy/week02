import {app} from "./index"

const port = process.env.PORT || 5000
app.listen(port, () => {console.log(`Listening on port ${port}. Press Ctrl+C to stop.`)})