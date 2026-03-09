import { ViteSSG } from 'vite-ssg';
import App from "./App.tsx";
import "./index.css";
import "./i18n";

export const createApp = ViteSSG(
    App,
    { routes: [] },
    () => {
        // Custom setup if needed
    }
);
