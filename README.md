# Two Hands, Two Touchpads: Optimizing Text Entry on Televisions

## Project Structure

The code for this project is split into 3 directories:

- `mobile-remote`: contains the logic for our mobile app which will detect touch input and send positional information to the server.
- `web-interface`: contains the keyboard interface and logic for mapping positional information onto the keyboard.
- `server`: contains logic for handling remote and web interface connections, and passes remote information to the web interface.

To run the project, first start the server, then start the web interface on the same device. The mobile remote will be run on a mobile device after the server and web interface are setup.

### Mobile Remote

The following command is used to start the mobile connection using expo. Note, you must be on a the same local network and not a UTD network.

```
npx expo start
```

### Web Interface

The following commands can be used to build and run the web interface module:

- `npm start`: Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
- `npm run build`: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Server

The following command is used to start the server:

```
npm start
```
