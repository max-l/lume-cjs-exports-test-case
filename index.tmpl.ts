import { Helper } from "lume/core.ts";
import React from "npm:react";
import ReactDOMServer from "npm:react-dom/server";
import App from "./app/app.jsx";

const ssr = ReactDOMServer.renderToString(React.createElement(App));

interface Helpers {
  [key: string]: Helper;
}

export default function (_data: unknown, { url }: Helpers) {
  return `<!doctype html>
	<html>
		<head>
			<meta charset="utf-8">					
			<link rel="stylesheet" href="${url("/styles.css")}">				
		</head>
		<body>
			<div id="app">${ssr}</div>
			<script type="module" src="${url("/main.js")}" bundle></script>
		</body>
	</html>
	`;
}
