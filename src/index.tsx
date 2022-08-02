import React from "react";
import { render } from "react-dom";
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
    faUser
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
);

const app = document.getElementById("app");
render(<App />, app);
