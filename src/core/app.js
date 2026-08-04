/**
 * ==========================================================
 * Medical Digital Twin
 * app.js
 * Main Application Bootstrap
 * ==========================================================
 */

import Store from "./store.js";
import Router from "./router.js";
import API from "./api.js";

import Header from "../components/layout/Header.js";
import BottomNav from "../components/layout/BottomNav.js";

import DashboardModule from "../modules/dashboard/DashboardModule.js";
import BodyModule from "../modules/body/BodyModule.js";
import ImagingModule from "../modules/imaging/ImagingModule.js";
import TimelineModule from "../modules/timeline/TimelineModule.js";
import InsightsModule from "../modules/insights/InsightsModule.js";
import ProfileModule from "../modules/profile/ProfileModule.js";
import SimulationModule from "../modules/simulation/SimulationModule.js";
import SettingsModule from "../modules/settings/SettingsModule.js";

class App {

    constructor(){

        this.initialized = false;

    }

    async init(){

        if(this.initialized){

            return;

        }

        console.log("🧬 Medical Digital Twin");

        try{

            await Store.init();

            await API.init();

            Router.init();

            Router.registerRoutes({

                dashboard : DashboardModule,

                body : BodyModule,

                imaging : ImagingModule,

                timeline : TimelineModule,

                insights : InsightsModule,

                profile : ProfileModule,

                simulation : SimulationModule,

                settings : SettingsModule,

            });

            Router.handleRoute();

            this.initialized = true;

        }

        catch(error){

            console.error(error);

        }

    }

}

const MDT = new App();

window.addEventListener(

    "DOMContentLoaded",

    () => MDT.init()

);

export default MDT;
