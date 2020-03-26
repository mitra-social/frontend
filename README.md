# mitra-frontend

The frontend powering Mitra - the distributed social network.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Project structure

- `assets/` — Where you put any assets that are imported into your components
- `components/` — All the components of the projects that are not the main views
  - `{domain}/` — We can have components that are reusable in different pages, so we shouldn't place them with the page components. However, they belong to a specific domain, in this case to the article domain. Call them domain components.
  - `common/` — components that belong to no domain, are not ui or layout. They can be some kind of utility components that have some logic but delegate the rendering to children components.
  - `layout/` — UI component those that are for ground structure
  - `ui`/ — UI components, those that are reusable across the whole app. They communicate just by using props and events, not holding any application logic.
- `mixins/` — The mixins are the parts of javascript code that is reused in different components. In a mixin you can put any component’s methods from Vue.js they will be merged with the ones of the component that uses it.
- `router/` — All the routes of your projects (in my case I have them in the index.js). Basically in Vue.js everything is a component. But not everything is a page. A page has a route like “/dashboard”, “/settings” or “/search”. If a component has a route it is routed.
- `store/` — The Vuex constants in mutation-type.js, the Vuex modules in the subfolder modules (which are then loaded in the index.js).
- `utils/` — Functions that I use in some components, such as regex value testing, constants or filters.
- `views/` — To make the project faster to read I separate the components that are routed and put them in this folder. The components that are routed for me are more than a component since they represent pages and they have routes, I put them in “views” then when you check a page you go to this folder.

## Docker

### Start up docker

```
docker-compose up
```

### Access

Once the Mitra frontend is up and running it is reachable over:

```
http://localhost:8080
```
