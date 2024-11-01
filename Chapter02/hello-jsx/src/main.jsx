import * as ReactDOM from "react-dom/client";
import { decryptStr, encryptStr } from "@/enc.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

let encText = encryptStr("Hello World!世界你好!~~!@#$%^&*()_____+{}|[]:'<>?,./");
let decText = decryptStr(encText);

root.render(<p>
  Hello, <strong>JSX</strong>
  <label>
    加密： { encText }
  </label>
  <label>
    解密： { decText }
  </label>
</p>);
