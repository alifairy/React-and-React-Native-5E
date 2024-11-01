import * as ReactDOM from "react-dom/client";
import {decryptStr, encryptStr} from "@/encrypt.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

let encText = encryptStr("Hello World!世界你好!~~!@#$%^&*()_____+{}|[]:'<>?,./");
let decText = decryptStr(encText);

root.render(<div>
    <p>Hello, <strong>JSX</strong></p>
    <p>
        加密： {encText}
    </p>
    <p>
        解密： {decText}
    </p>
</div>);
