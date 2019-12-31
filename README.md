# desync

A CLI tool to detect and confirm HTTP/S desync vulnerabilities.

**Note:** this tool is meant for personal research and testing purposes.

## Overview

This tool was inspired by [this post](https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn) on HTTP desync attacks. Often times, a frontend server handles a web request before sending it to a backend server. Desync vulnerabilities arise when the frontend and backend servers disagree on request body lengths/boundaries and, as a result, process different requests.

This tool sends specially-crafted HTTP/S requests with Content-Length *and* Transfer-Encoding headers. Suppose the frontend reads one header (e.g. Content-Length) and the backend reads the other (Transfer-Encoding). The request is structured such that the backend will never receive what it believes to be the entire request body, so we should time out waiting for a response. This is how we detect a smuggling vulnerability, in this case a CL.TE vulnerability since the frontend read the Content-Length and the backend read the Transfer-Encoding header.

The next step is to confirm the vulnerability. Instead of forcing a timeout, we'll try to smuggle a request for a nonexistent endpoint to the backend. If the backend processes the smuggled request, it should respond with a 404 or redirect.

## Usage

`$ [code=<integer>] [verbose=true] desync <url>`

### Examples

The following example detects and confirms a CL.TE vulnerability at "foobar.com".

```
$ desync https://foobar.com
clte: Detected!
clte: Confirmed!
Done!
```

You can enable verbose mode to see why a vulnerability *wasn't* detected.

```
$ verbose=true desync https://foobar.com
tecl: Expected timeout, got response with status code 200
clte: Detected!
clte: Confirmed!
Done!
```

Sometimes during the confirm step, a web server will respond to the smuggled request with a non-404 status code (e.g. 302 redirect). You can specify the expected status code as follows.

```
$ code=302 desync https://foobaz.com
clte: Detected!
clte: Confirmed!
Done!
```

## Contributing

Please do!

If you find a bug, want to add a feature/enhancement, or have a question, feel free to [open an issue](https://github.com/zbo14/desync/issues/new). You're also welcome to [create a pull request](https://github.com/zbo14/desync/compare/develop...) addressing an issue. You should push your changes to a feature branch and request merge to `develop`.
