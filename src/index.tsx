import { ChakraProvider } from "@chakra-ui/react"
import React from "react"
import ReactDOM from "react-dom"
import WebFont from "webfontloader"
import App from "./App"
import "./styles.css"

WebFont.load({
  google: { families: ["Roboto"] },
})

ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById("app"),
)
