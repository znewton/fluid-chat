import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faQuestionCircle,
    faScrewdriverWrench,
    faCaretUp,
    faCaretDown,
    faWeightHanging,
    faPaperPlane,
    faCompress,
    faEnvelope,
    faEnvelopesBulk,
    faExpand,
    faHandPeace,
    faPlugCircleExclamation,
    faRightFromBracket,
    faRightToBracket,
    faMoon,
    faRightLeft,
    faSun,
    faUser,
    faShuffle,
    faKey,
    faCirclePlay,
    faCircleStop,
    faLocationArrow,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

// Preload icons
library.add(
    faQuestionCircle,
    faScrewdriverWrench,
    faCaretUp,
    faCaretDown,
    faWeightHanging,
    faPaperPlane,
    faCompress,
    faEnvelope,
    faEnvelopesBulk,
    faExpand,
    faHandPeace,
    faPlugCircleExclamation,
    faRightFromBracket,
    faRightToBracket,
    faMoon,
    faRightLeft,
    faSun,
    faUser,
    faShuffle,
    faKey,
    faCirclePlay,
    faCircleStop,
    faLocationArrow,
    faPlus,
);

// Render app
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
