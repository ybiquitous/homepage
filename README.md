# ybiquitous homepage

Visit [ybiquitous.me](https://ybiquitous.me).

## Development

### Install

Install NPM packages.

```sh
npm ci
```

### Build

Bulid static files.

```sh
npm run build
```

### View

Publish `public/` directory on HTTP server. For example:

```sh
python3 -m http.server --directory public/
```

```sh
open http://localhost:8000/
```

### Deploy

Just push to `master` branch. Build & publish automatically on [Netlify](https://www.netlify.com/).

```sh
git push origin master
```
