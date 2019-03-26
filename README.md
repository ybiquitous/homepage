# ybiquitous homepage

Visit [ybiquitous.me](https://ybiquitous.me).

## Development

### Install

Install NPM packages.

```sh
npm ci
```

### Start server

Start a development server on localhost.

```sh
npm run dev
```

### Build

Bulid static files.

```sh
npm run build
```

### View

Publish `dist/` directory on HTTP server. For example:

```sh
python3 -m http.server --directory dist/
```

Then, open [localhost:8000](http://localhost:8000/) in your browser.

### Deploy

Just push to `master` branch. Build & publish automatically on [Netlify](https://www.netlify.com/).

```sh
git push origin master
```

## Stack

- [React](https://reactjs.org/)
- [Parcel](https://parceljs.org/)
