import { createBrowserRouter } from "react-router-dom";
import { ProvideToken } from "../login/provideToken";
import App from "../../App";

export const router = createBrowserRouter([
    {
        path: '',
        element: <ProvideToken />
    },
    {
        path: '/lastPosition',
        element: <App />
    }
]
)